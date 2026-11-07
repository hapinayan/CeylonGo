// =============================================================================
// CeylonGo — Core JWT HTTP Interceptor
// Attaches Bearer JWT access token strictly to approved FastAPI backend requests.
// Security: Origin verification, path boundary matching, zero storage access.
// =============================================================================

import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { InjectionToken, inject } from '@angular/core';
import { AuthService, AUTH_API_URL } from '../services/auth.service';

/**
 * InjectionToken to explicitly permit same-origin /api proxy requests.
 * Defaults to false — a same-origin proxy is never assumed to exist.
 */
export const ALLOW_SAME_ORIGIN_PROXY = new InjectionToken<boolean>(
  'ALLOW_SAME_ORIGIN_PROXY',
  {
    providedIn: 'root',
    factory: () => false,
  }
);

/**
 * Validates whether an HTTP request targets an approved CeylonGo FastAPI backend endpoint.
 *
 * Hardened security rules:
 * 1. Rejects URLs containing backslashes ('\') or encoded backslashes ('%5C') to prevent origin escapes.
 * 2. Rejects protocol-relative URLs ('//...') and control characters.
 * 3. For absolute URLs: requires exact match with configured backend origin (protocol, hostname, port).
 * 4. For relative URLs: requires that fully resolved origin strictly matches browser trusted same-origin,
 *    AND that an approved same-origin proxy is explicitly enabled (does not assume proxy exists).
 * 5. Strict path boundary matching: exactly '/api' or starting with '/api/'.
 * 6. Excludes public authentication endpoints (e.g. POST /api/auth/login).
 */
export function isApprovedBackendRequest(
  req: HttpRequest<unknown>,
  configuredApiUrl: string,
  allowSameOriginProxy: boolean = false
): boolean {
  const rawUrl = req.url;
  if (!rawUrl || typeof rawUrl !== 'string') {
    return false;
  }

  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return false;
  }

  // Reject URLs containing backslashes or percent-encoded backslashes (origin escape attempt)
  if (trimmed.includes('\\') || /%5c/i.test(trimmed)) {
    return false;
  }

  // Reject protocol-relative URLs (e.g. '//evil.com/api')
  if (trimmed.startsWith('//')) {
    return false;
  }

  // Reject whitespace or control characters within URL
  if (/[\s\r\n\t]/.test(trimmed)) {
    return false;
  }

  // Resolve trusted browser origin
  const browserOrigin =
    typeof window !== 'undefined' && window.location?.origin
      ? window.location.origin
      : 'http://localhost';

  // Parse backend origin from configured AUTH_API_URL (e.g. 'http://localhost:8000')
  let configuredOrigin: string | null = null;
  if (configuredApiUrl && configuredApiUrl.trim().length > 0) {
    try {
      const parsedConfig = new URL(configuredApiUrl.trim());
      if (parsedConfig.protocol === 'http:' || parsedConfig.protocol === 'https:') {
        configuredOrigin = parsedConfig.origin;
      }
    } catch {
      configuredOrigin = null;
    }
  }

  // Determine if URL is absolute with scheme
  const isAbsolute = /^[a-zA-Z][a-zA-Z\d+\-.]*?:/.test(trimmed);

  let requestUrl: URL;
  try {
    if (isAbsolute) {
      requestUrl = new URL(trimmed);
    } else {
      // Relative URL: resolve against trusted browser origin
      requestUrl = new URL(trimmed, browserOrigin);
    }
  } catch {
    return false;
  }

  // 1. Origin verification
  if (isAbsolute) {
    // Absolute URLs MUST match the configured backend origin exactly
    if (!configuredOrigin || requestUrl.origin !== configuredOrigin) {
      return false;
    }
  } else {
    // Relative URL verification:
    // a. Fully resolved origin MUST strictly match browser trusted same-origin
    if (requestUrl.origin !== browserOrigin) {
      return false;
    }

    // b. Permit same-origin /api requests ONLY when an approved proxy is explicitly enabled
    const isProxyExplicitlyEnabled =
      allowSameOriginProxy || (configuredOrigin !== null && configuredOrigin === browserOrigin);

    if (!isProxyExplicitlyEnabled) {
      return false;
    }
  }

  // 2. Strict API path boundary validation (/api or /api/...)
  const pathname = requestUrl.pathname;
  const isApiPath = pathname === '/api' || pathname.startsWith('/api/');
  if (!isApiPath) {
    return false;
  }

  // 3. Exclude public login request (POST /api/auth/login)
  const normalizedPath = pathname.replace(/\/+$/, '');
  const isLoginRequest =
    req.method.toUpperCase() === 'POST' && normalizedPath === '/api/auth/login';
  if (isLoginRequest) {
    return false;
  }

  return true;
}

/**
 * Functional HTTP Interceptor that attaches the Bearer JWT token to authorized backend calls.
 */
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const authApiUrl = inject(AUTH_API_URL, { optional: true }) ?? '';
  const allowProxy = inject(ALLOW_SAME_ORIGIN_PROXY, { optional: true }) ?? false;

  const token = authService.getAccessToken();

  // If no valid in-memory token exists or request is not an approved backend call, proceed unmodified
  if (!token || !isApprovedBackendRequest(req, authApiUrl, allowProxy)) {
    return next(req);
  }

  // Attach Authorization header without mutating the original request
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(authReq);
};
