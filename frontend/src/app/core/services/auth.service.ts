// =============================================================================
// CeylonGo — Core Authentication Service
// Contract: POST /api/auth/login (FastAPI backend)
// Security: In-memory JWT access token; strict Tourist role enforcement
// =============================================================================

import { HttpClient } from '@angular/common/http';
import { Injectable, InjectionToken, OnDestroy, computed, inject, signal } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AuthUser, LoginRequest, LoginResponse } from '../models/auth.models';

/**
 * Injection token for the FastAPI backend base URL (e.g. 'http://localhost:8000').
 * Configured in app.config.ts after confirming server address with Patithijan.
 * Defaults to an empty string to support relative paths or local proxy.
 */
export const AUTH_API_URL = new InjectionToken<string>('AUTH_API_URL', {
  providedIn: 'root',
  factory: () => '',
});

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(AUTH_API_URL, { optional: true }) ?? '';

  // In-memory authentication state (never persisted in localStorage, sessionStorage, or cookies)
  private readonly _accessToken = signal<string | null>(null);
  private readonly _currentUser = signal<AuthUser | null>(null);
  private _expiresAt: number | null = null;
  private _expiryTimer: ReturnType<typeof setTimeout> | null = null;

  /**
   * Read-only signal exposing the currently authenticated tourist profile, or null.
   */
  readonly currentUser = this._currentUser.asReadonly();

  /**
   * Computed boolean signal indicating whether an active, valid tourist session exists.
   */
  readonly isAuthenticated = computed(() => {
    const user = this._currentUser();
    const token = this._accessToken();
    if (!user || !token || this._expiresAt === null) {
      return false;
    }
    return Date.now() < this._expiresAt;
  });

  ngOnDestroy(): void {
    this.clearExpiryTimer();
  }

  /**
   * Resolves the login endpoint using the configured base URL without trailing slash.
   */
  private get loginEndpoint(): string {
    const base = this.apiBaseUrl ? this.apiBaseUrl.replace(/\/+$/, '') : '';
    return `${base}/api/auth/login`;
  }

  /**
   * Submits credentials to FastAPI POST /api/auth/login.
   *
   * Validates server response structure and strictly enforces that only 'Tourist'
   * accounts can authenticate. Vendor and Admin accounts are rejected with an Error
   * without creating any in-memory session.
   *
   * @param emailOrCredentials LoginRequest object or email string
   * @param maybePassword Password string if first argument was an email
   */
  login(credentials: LoginRequest): Observable<AuthUser>;
  login(email: string, password: string): Observable<AuthUser>;
  login(emailOrCredentials: string | LoginRequest, maybePassword?: string): Observable<AuthUser> {
    const payload: LoginRequest =
      typeof emailOrCredentials === 'string'
        ? { email: emailOrCredentials, password: maybePassword ?? '' }
        : emailOrCredentials;

    return this.http.post<LoginResponse>(this.loginEndpoint, payload).pipe(
      map((response) => {
        if (!this.isValidLoginResponse(response)) {
          throw new Error('Malformed authentication response from server.');
        }

        // Strict role validation: only Tourist role allowed on this portal
        if (response.user.role !== 'Tourist') {
          throw new Error('Access restricted: Only Tourist accounts can sign in to this portal.');
        }

        this.setSession(response);
        return response.user;
      })
    );
  }

  /**
   * Logs out the current user by clearing the in-memory token, profile, and expiry timer.
   * Note: The backend uses stateless 30-minute JWT bearer tokens without server-side
   * revocation; logout clears frontend session state only.
   */
  logout(): void {
    this.clearExpiryTimer();
    this._accessToken.set(null);
    this._currentUser.set(null);
    this._expiresAt = null;
  }

  /**
   * Returns the current access token if present and not expired, or null.
   * Strictly verifies token expiration against in-memory timestamp and clears
   * the session immediately if expired.
   */
  getAccessToken(): string | null {
    const token = this._accessToken();
    if (!token || this._expiresAt === null) {
      return null;
    }

    if (Date.now() >= this._expiresAt) {
      this.logout();
      return null;
    }

    return token;
  }

  /**
   * Validates the structure and types of the response from POST /api/auth/login.
   *
   * Hardened validation:
   * - token_type must match 'bearer' per agreed contract
   * - expires_in must be a finite positive number <= 1800s (30 minutes)
   * - user.id must be a positive integer as in CeylonGo_Login_Schema.sql
   */
  private isValidLoginResponse(res: unknown): res is LoginResponse {
    if (!res || typeof res !== 'object') {
      return false;
    }

    const r = res as Partial<LoginResponse>;
    const hasValidToken = typeof r.access_token === 'string' && r.access_token.trim().length > 0;
    const hasValidTokenType = r.token_type === 'bearer';
    const maxExpiresInSeconds = 1800;
    const hasValidExpiresIn =
      typeof r.expires_in === 'number' &&
      Number.isFinite(r.expires_in) &&
      r.expires_in > 0 &&
      r.expires_in <= maxExpiresInSeconds;

    const user = r.user;
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
      (user.role === 'Tourist' || user.role === 'Vendor' || user.role === 'Admin');

    return hasValidToken && hasValidTokenType && hasValidExpiresIn && hasValidUser;
  }

  /**
   * Stores the session in memory and arms a timer to auto-clear the session on expiry.
   */
  private setSession(response: LoginResponse): void {
    this.clearExpiryTimer();

    this._accessToken.set(response.access_token);
    this._currentUser.set(response.user);
    this._expiresAt = Date.now() + response.expires_in * 1000;

    // Automatically clear in-memory state when the token expires
    this._expiryTimer = setTimeout(() => {
      this.logout();
    }, response.expires_in * 1000);
  }

  /**
   * Clears any active token expiry timeout.
   */
  private clearExpiryTimer(): void {
    if (this._expiryTimer) {
      clearTimeout(this._expiryTimer);
      this._expiryTimer = null;
    }
  }
}
