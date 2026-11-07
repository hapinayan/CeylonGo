// ignore_for_file: prefer_initializing_formals

import '../datasources/auth_api_client.dart';
import '../models/auth_models.dart';
import '../../../../core/storage/secure_storage_service.dart';

/// Result of an authentication attempt.
///
/// On success, contains the [AuthUser] and a `null` [errorMessage].
/// On failure, contains a safe, user-facing [errorMessage] and a `null` [user].
class AuthResult {
  const AuthResult._({this.user, this.errorMessage});

  factory AuthResult.success(AuthUser user) =>
      AuthResult._(user: user);

  factory AuthResult.failure(String message) =>
      AuthResult._(errorMessage: message);

  final AuthUser? user;
  final String? errorMessage;

  bool get isSuccess => user != null && errorMessage == null;
}

/// Authentication repository for CeylonGo Module 04.
///
/// Orchestrates the login flow:
/// 1. Calls [AuthApiClient.login] to authenticate with the FastAPI backend.
/// 2. Validates the returned role is allowed on mobile (Vendor or Admin).
/// 3. Persists the JWT session via [SecureStorageService].
///
/// Does NOT manage navigation or UI state.
class AuthRepository {
  /// Creates an [AuthRepository] with the given dependencies.
  AuthRepository({
    required AuthApiClient apiClient,
    required SecureStorageService storageService,
  })  : _apiClient = apiClient,
        _storageService = storageService;

  final AuthApiClient _apiClient;
  final SecureStorageService _storageService;

  /// Authenticates the user and stores the session on success.
  ///
  /// Returns an [AuthResult] with the user on success, or a safe
  /// error message on failure. Never throws.
  Future<AuthResult> login(String email, String password) async {
    try {
      final request = LoginRequest(email: email, password: password);
      final response = await _apiClient.login(request);

      // Validate role is allowed on mobile
      if (!response.user.isAllowedOnMobile) {
        return AuthResult.failure(
          'This app is only available for Vendor and Admin accounts. '
          'Tourist users should use the web portal.',
        );
      }

      // Persist JWT session
      await _storageService.saveSession(
        response.accessToken,
        response.expiresIn,
      );

      return AuthResult.success(response.user);
    } on AuthApiException catch (e) {
      return AuthResult.failure(e.message);
    } on ArgumentError catch (e) {
      return AuthResult.failure(
        e.message?.toString() ?? 'Invalid input. Please try again.',
      );
    } catch (_) {
      return AuthResult.failure(
        'An unexpected error occurred. Please try again.',
      );
    }
  }

  /// Clears the stored authentication session.
  ///
  /// Returns `true` if the session was cleared successfully, `false` otherwise.
  Future<bool> logout() async {
    try {
      await _storageService.clearSession();
      return true;
    } catch (_) {
      return false;
    }
  }

  /// Checks whether a valid (non-expired) session exists.
  Future<bool> hasValidSession() async {
    final token = await _storageService.readValidAccessToken();
    return token != null;
  }

  /// Disposes the underlying API client.
  void dispose() {
    _apiClient.dispose();
  }
}
