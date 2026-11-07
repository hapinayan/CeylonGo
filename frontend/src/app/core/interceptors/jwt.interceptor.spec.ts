import { HttpRequest } from '@angular/common/http';
import { isApprovedBackendRequest } from './jwt.interceptor';

describe('jwtInterceptor URL Security Hardening', () => {
  const backendOrigin = 'http://localhost:8000';

  it('approves legitimate backend API requests with correct origin and /api path', () => {
    const req = new HttpRequest('GET', 'http://localhost:8000/api/tourists/profile');
    const result = isApprovedBackendRequest(req, backendOrigin);
    expect(result).toBe(true);
  });

  it('rejects lookalike hostnames (e.g. localhost:8000.evil.com)', () => {
    const req = new HttpRequest('GET', 'http://localhost:8000.evil.com/api/tourists/profile');
    const result = isApprovedBackendRequest(req, backendOrigin);
    expect(result).toBe(false);
  });

  it('rejects incorrect ports (e.g. localhost:8001)', () => {
    const req = new HttpRequest('GET', 'http://localhost:8001/api/tourists/profile');
    const result = isApprovedBackendRequest(req, backendOrigin);
    expect(result).toBe(false);
  });

  it('rejects backslash-based origin escapes (e.g. /\\evil.com/api or /api\\evil)', () => {
    const req1 = new HttpRequest('GET', '/\\evil.com/api/data');
    const req2 = new HttpRequest('GET', 'http://localhost:8000\\evil.com/api');
    const req3 = new HttpRequest('GET', '/api/%5cevil/data');

    expect(isApprovedBackendRequest(req1, backendOrigin, true)).toBe(false);
    expect(isApprovedBackendRequest(req2, backendOrigin, true)).toBe(false);
    expect(isApprovedBackendRequest(req3, backendOrigin, true)).toBe(false);
  });

  it('rejects protocol-relative URLs (e.g. //evil.com/api/data)', () => {
    const req = new HttpRequest('GET', '//evil.com/api/data');
    expect(isApprovedBackendRequest(req, backendOrigin, true)).toBe(false);
  });

  it('rejects unapproved relative URLs when proxy is not explicitly enabled', () => {
    const req = new HttpRequest('GET', '/api/bookings');
    // By default, allowSameOriginProxy is false
    const result = isApprovedBackendRequest(req, backendOrigin, false);
    expect(result).toBe(false);
  });

  it('approves relative URLs only when proxy is explicitly enabled', () => {
    const req = new HttpRequest('GET', '/api/bookings');
    const result = isApprovedBackendRequest(req, backendOrigin, true);
    expect(result).toBe(true);
  });

  it('excludes public login requests (POST /api/auth/login)', () => {
    const req = new HttpRequest('POST', 'http://localhost:8000/api/auth/login', {
      email: 'tourist@ceylongo.com',
      password: 'Password123',
    });
    const result = isApprovedBackendRequest(req, backendOrigin);
    expect(result).toBe(false);
  });

  it('rejects path boundary violations (e.g. /api-evil or /apidoc)', () => {
    const req1 = new HttpRequest('GET', 'http://localhost:8000/api-evil/data');
    const req2 = new HttpRequest('GET', 'http://localhost:8000/apidoc/data');
    expect(isApprovedBackendRequest(req1, backendOrigin)).toBe(false);
    expect(isApprovedBackendRequest(req2, backendOrigin)).toBe(false);
  });

  it('rejects unapproved third-party domains (e.g. maps, cdn)', () => {
    const req1 = new HttpRequest('GET', 'https://maps.googleapis.com/maps/api/geocode/json');
    const req2 = new HttpRequest('GET', 'https://cdn.example.com/api/v1/image.png');
    expect(isApprovedBackendRequest(req1, backendOrigin)).toBe(false);
    expect(isApprovedBackendRequest(req2, backendOrigin)).toBe(false);
  });
});
