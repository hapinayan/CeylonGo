
import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { AuthService } from './auth.service';
import { LoginResponse, UserRole } from '../models/auth.models';

describe('AuthService Security Tests', () => {
  let authService: AuthService;
  let httpMock: HttpTestingController;

  const loginUrl = '/api/auth/login';

  const credentials = {
    email: 'tourist@example.com',
    password: 'test-password',
  };

  function mockLoginResponse(
    role: UserRole = 'Tourist',
    expiresIn = 1800
  ): LoginResponse {
    return {
      access_token: 'fake-jwt-for-unit-testing-only',
      token_type: 'bearer',
      expires_in: expiresIn,
      user: {
        id: 1,
        name: 'Test User',
        email: credentials.email,
        role,
      },
    };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    authService = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    authService.logout();
    httpMock.verify();
    vi.restoreAllMocks();
  });

  function loginAsTourist(expiresIn = 1800): void {
    let loginSucceeded = false;

    authService.login(credentials).subscribe({
      next: (user) => {
        expect(user.role).toBe('Tourist');
        loginSucceeded = true;
      },
    });

    const request = httpMock.expectOne(loginUrl);

    expect(request.request.method).toBe('POST');

    request.flush(mockLoginResponse('Tourist', expiresIn));

    expect(loginSucceeded).toBe(true);
  }

  // TEST 1: Logout clears JWT and user information.
  it('clears JWT and user state after logout', () => {
    loginAsTourist();

    expect(authService.isAuthenticated()).toBe(true);
    expect(authService.getAccessToken()).not.toBeNull();
    expect(authService.currentUser()).not.toBeNull();

    authService.logout();

    expect(authService.getAccessToken()).toBeNull();
    expect(authService.currentUser()).toBeNull();
    expect(authService.isAuthenticated()).toBe(false);
  });

  // TEST 2 & 3: Vendor and Admin must be rejected.
  for (const role of ['Vendor', 'Admin'] as const) {
    it(`rejects ${role} and clears the previous session`, () => {
      loginAsTourist();

      expect(authService.isAuthenticated()).toBe(true);

      let rejectionMessage = '';

      authService.login(credentials).subscribe({
        error: (error: Error) => {
          rejectionMessage = error.message;
        },
      });

      // Previous Tourist session must be cleared immediately.
      expect(authService.getAccessToken()).toBeNull();
      expect(authService.currentUser()).toBeNull();

      const request = httpMock.expectOne(loginUrl);

      request.flush(mockLoginResponse(role));

      expect(rejectionMessage).toContain('Only Tourist');

      expect(authService.getAccessToken()).toBeNull();
      expect(authService.currentUser()).toBeNull();
      expect(authService.isAuthenticated()).toBe(false);
    });
  }

  // TEST 4: Wrong password cannot retain previous login.
  it('clears the previous session when login returns 401', () => {
    loginAsTourist();

    expect(authService.isAuthenticated()).toBe(true);

    let errorStatus: number | null = null;

    authService.login(credentials).subscribe({
      error: (error: HttpErrorResponse) => {
        errorStatus = error.status;
      },
    });

    const request = httpMock.expectOne(loginUrl);

    request.flush(
      { detail: 'Invalid email or password' },
      {
        status: 401,
        statusText: 'Unauthorized',
      }
    );

    expect(errorStatus).toBe(401);
    expect(authService.getAccessToken()).toBeNull();
    expect(authService.currentUser()).toBeNull();
    expect(authService.isAuthenticated()).toBe(false);
  });

  // TEST 5: Expired session tokens cannot be reused.
  it('rejects an expired access token and clears the session', () => {
    loginAsTourist(1);

    expect(authService.isAuthenticated()).toBe(true);
    expect(authService.getAccessToken()).not.toBeNull();

    // Simulate a point in time after the 1-second expiry.
    const futureTime = Date.now() + 2000;

    vi.spyOn(Date, 'now').mockReturnValue(futureTime);

    expect(authService.getAccessToken()).toBeNull();
    expect(authService.currentUser()).toBeNull();
    expect(authService.isAuthenticated()).toBe(false);

    // An expired session must not restore authenticated access.
    expect(authService.getAccessToken()).toBeNull();
  });
});
