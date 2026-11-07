
import { HttpClient } from '@angular/common/http';
import {
  Injectable,
  InjectionToken,
  OnDestroy,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Observable, map } from 'rxjs';

import {
  AuthUser,
  LoginRequest,
  LoginResponse,
} from '../models/auth.models';

// Backend API base URL.
// Empty string means Angular uses the local /api proxy.
export const AUTH_API_URL = new InjectionToken<string>('AUTH_API_URL', {
  providedIn: 'root',
  factory: () => '',
});

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private readonly http = inject(HttpClient);

  private readonly apiBaseUrl =
    inject(AUTH_API_URL, { optional: true }) ?? '';

  // JWT and user information are kept in memory only.
  private readonly _accessToken = signal<string | null>(null);

  private readonly _currentUser = signal<AuthUser | null>(null);

  private _expiresAt: number | null = null;

  private _expiryTimer: ReturnType<typeof setTimeout> | null = null;

  // Public read-only user state.
  readonly currentUser = this._currentUser.asReadonly();

  // Authentication status.
  readonly isAuthenticated = computed(() => {
    const user = this._currentUser();
    const token = this._accessToken();

    if (!user || !token || this._expiresAt === null) {
      return false;
    }

    return Date.now() < this._expiresAt;
  });

  // Login API endpoint.
  private get loginEndpoint(): string {
    const base = this.apiBaseUrl
      ? this.apiBaseUrl.replace(/\/+$/, '')
      : '';

    return `${base}/api/auth/login`;
  }

  // Login using a request object.
  login(credentials: LoginRequest): Observable<AuthUser>;

  // Login using email and password.
  login(email: string, password: string): Observable<AuthUser>;

  login(
    emailOrCredentials: string | LoginRequest,
    maybePassword?: string
  ): Observable<AuthUser> {
    const payload: LoginRequest =
      typeof emailOrCredentials === 'string'
        ? {
            email: emailOrCredentials,
            password: maybePassword ?? '',
          }
        : emailOrCredentials;

    // SECURITY FIX:
    // Clear any previous JWT and user information before
    // starting a new login attempt.
    this.logout();

    return this.http
      .post<LoginResponse>(this.loginEndpoint, payload)
      .pipe(
        map((response) => {
          // Check the backend response.
          if (!this.isValidLoginResponse(response)) {
            throw new Error(
              'Malformed authentication response from server.'
            );
          }

          // Only Tourist accounts can access Angular website.
          if (response.user.role !== 'Tourist') {
            throw new Error(
              'Access restricted: Only Tourist accounts can sign in to this portal.'
            );
          }

          // Store valid Tourist session.
          this.setSession(response);

          return response.user;
        })
      );
  }

  // Logout and clear authentication information.
  logout(): void {
    this.clearExpiryTimer();

    this._accessToken.set(null);

    this._currentUser.set(null);

    this._expiresAt = null;
  }

  // Return only a valid, non-expired access token.
  getAccessToken(): string | null {
    const token = this._accessToken();

    if (!token || this._expiresAt === null) {
      return null;
    }

    // Expired token must never be returned.
    if (Date.now() >= this._expiresAt) {
      this.logout();
      return null;
    }

    return token;
  }

  // Validate FastAPI login response.
  private isValidLoginResponse(
    res: unknown
  ): res is LoginResponse {
    if (!res || typeof res !== 'object') {
      return false;
    }

    const response = res as Partial<LoginResponse>;

    const hasValidToken =
      typeof response.access_token === 'string' &&
      response.access_token.trim().length > 0;

    const hasValidTokenType =
      response.token_type === 'bearer';

    // Backend JWT expiry must not exceed 30 minutes.
    const maxExpiresInSeconds = 1800;

    const hasValidExpiresIn =
      typeof response.expires_in === 'number' &&
      Number.isFinite(response.expires_in) &&
      response.expires_in > 0 &&
      response.expires_in <= maxExpiresInSeconds;

    const user = response.user;

    const hasValidUser =
      !!user &&
      typeof user === 'object' &&
      typeof user.id === 'number' &&
      Number.isInteger(user.id) &&
      user.id > 0 &&
      typeof user.name === 'string' &&
      user.name.trim().length > 0 &&
      typeof user.email === 'string' &&
      user.email.trim().length > 0 &&
      (
        user.role === 'Tourist' ||
        user.role === 'Vendor' ||
        user.role === 'Admin'
      );

    return (
      hasValidToken &&
      hasValidTokenType &&
      hasValidExpiresIn &&
      hasValidUser
    );
  }

  // Save a successful Tourist login session in memory.
  private setSession(response: LoginResponse): void {
    this.clearExpiryTimer();

    this._accessToken.set(response.access_token);

    this._currentUser.set(response.user);

    this._expiresAt =
      Date.now() + response.expires_in * 1000;

    // Automatically logout when the JWT session expires.
    this._expiryTimer = setTimeout(() => {
      this.logout();
    }, response.expires_in * 1000);
  }

  // Clear the existing expiry timer.
  private clearExpiryTimer(): void {
    if (this._expiryTimer !== null) {
      clearTimeout(this._expiryTimer);

      this._expiryTimer = null;
    }
  }

  ngOnDestroy(): void {
    this.clearExpiryTimer();
  }
}
