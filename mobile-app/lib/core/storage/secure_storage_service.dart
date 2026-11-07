import 'package:flutter_secure_storage/flutter_secure_storage.dart';

/// Secure token and session storage service for CeylonGo.
///
/// Uses [FlutterSecureStorage] (Android Keystore / iOS Keychain) to persist
/// the authenticated JWT access token and its absolute UTC expiration timestamp.
///
/// Security constraints:
/// - Never stores passwords, plaintext credentials, or signing secrets.
/// - Deletes only module-owned keys during [clearSession] (never calls deleteAll).
/// - Validates expiration metadata and clears invalid or expired sessions immediately.
/// - Ensures partial write failures do not leave an apparently valid session.
/// - Attempts deletion of all module-owned keys and does not claim success if deletion fails.
class SecureStorageService {
  /// Creates a [SecureStorageService] instance with optional dependency injection.
  SecureStorageService({FlutterSecureStorage? storage})
      : _storage = storage ?? const FlutterSecureStorage();

  final FlutterSecureStorage _storage;

  /// App-specific storage keys owned by this module.
  static const String keyAccessToken = 'ceylongo_auth_access_token';
  static const String keyExpiresAt = 'ceylongo_auth_expires_at';

  /// Maximum allowed token lifetime in seconds according to CeylonGo contract (30 minutes).
  static const int maxExpiresInSeconds = 1800;

  /// Saves the authenticated JWT access token and its absolute UTC expiration timestamp.
  ///
  /// Throws [ArgumentError] if [accessToken] is empty or [expiresIn] is not a positive
  /// integer within [1, 1800].
  ///
  /// If any storage write operation fails, all module keys are purged to prevent
  /// leaving a partial or mismatched session state.
  Future<void> saveSession(String accessToken, int expiresIn) async {
    final sanitizedToken = accessToken.trim();
    if (sanitizedToken.isEmpty) {
      throw ArgumentError('Access token must not be empty.');
    }

    if (expiresIn <= 0 || expiresIn > maxExpiresInSeconds) {
      throw ArgumentError(
        'expiresIn must be a positive integer between 1 and $maxExpiresInSeconds seconds.',
      );
    }

    final expiresAtUtc = DateTime.now().toUtc().add(Duration(seconds: expiresIn));

    try {
      await _storage.write(key: keyExpiresAt, value: expiresAtUtc.toIso8601String());
      await _storage.write(key: keyAccessToken, value: sanitizedToken);
    } catch (_) {
      // Purge both keys on failure to guarantee no partial or orphaned session remains.
      await _safePurgeKeys();
      throw Exception('Failed to securely store authentication session.');
    }
  }

  /// Reads and returns the stored access token only if present, valid, and unexpired.
  ///
  /// If the token is missing, expired, or its expiration metadata cannot be parsed,
  /// this method purges the stale session keys and returns `null`.
  Future<String?> readValidAccessToken() async {
    try {
      final token = await _storage.read(key: keyAccessToken);
      final expiresAtRaw = await _storage.read(key: keyExpiresAt);

      if (token == null || token.trim().isEmpty || expiresAtRaw == null) {
        await _safePurgeKeys();
        return null;
      }

      final expiresAtUtc = DateTime.tryParse(expiresAtRaw)?.toUtc();
      if (expiresAtUtc == null) {
        await _safePurgeKeys();
        return null;
      }

      final nowUtc = DateTime.now().toUtc();
      if (!expiresAtUtc.isAfter(nowUtc)) {
        // Token has expired; remove stale session
        await _safePurgeKeys();
        return null;
      }

      return token.trim();
    } catch (_) {
      // Securely recover on storage read errors by clearing keys and returning null.
      await _safePurgeKeys();
      return null;
    }
  }

  /// Removes only the authentication keys owned by CeylonGo Module 04.
  ///
  /// Always attempts to delete both keys even if deleting the first key fails.
  /// Throws [Exception] if any deletion operation fails, avoiding silent false
  /// claims of successful session cleanup.
  Future<void> clearSession() async {
    Object? firstError;

    try {
      await _storage.delete(key: keyAccessToken);
    } catch (e) {
      firstError = e;
    }

    try {
      await _storage.delete(key: keyExpiresAt);
    } catch (e) {
      firstError ??= e;
    }

    if (firstError != null) {
      throw Exception('Failed to securely clear session from storage.');
    }
  }

  /// Internal best-effort deletion helper for cleanups during read/write failures.
  /// Suppresses exceptions so callers can complete their teardown safely.
  Future<void> _safePurgeKeys() async {
    try {
      await _storage.delete(key: keyAccessToken);
    } catch (_) {}
    try {
      await _storage.delete(key: keyExpiresAt);
    } catch (_) {}
  }
}
