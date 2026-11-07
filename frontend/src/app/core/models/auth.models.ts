// =============================================================================
// CeylonGo — Core Authentication Models
// Contract: Agreed FastAPI Login API (POST /api/auth/login)
// =============================================================================

/**
 * Valid user roles recognized in CeylonGo.
 * In the Tourist portal, only 'Tourist' is granted access.
 */
export type UserRole = 'Tourist' | 'Vendor' | 'Admin';

/**
 * Payload sent to the backend during login.
 * Password hashes and credentials must never be exposed or persisted.
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Authenticated user profile returned by the backend.
 * User ID is numeric as defined in database/CeylonGo_Login_Schema.sql.
 */
export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

/**
 * Response payload returned by FastAPI POST /api/auth/login.
 * Contains a 30-minute bearer JWT access token and user metadata.
 */
export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: AuthUser;
}
