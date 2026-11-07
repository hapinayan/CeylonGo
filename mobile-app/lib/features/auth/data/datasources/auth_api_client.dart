import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'package:http/http.dart' as http;

import '../models/auth_models.dart';

/// Exception thrown by [AuthApiClient] with safe, user-facing messages.
///
/// Never includes JWT values, passwords, authorization headers, or
/// raw API response bodies in its message.
class AuthApiException implements Exception {
  const AuthApiException(this.message, {this.statusCode});

  /// Safe, user-facing error message suitable for display in the UI.
  final String message;

  /// HTTP status code returned by the server, if available.
  final int? statusCode;

  @override
  String toString() => 'AuthApiException: $message';
}

/// HTTP client for the CeylonGo FastAPI authentication endpoint.
///
/// Responsibilities:
/// - Sends `POST /api/auth/login` with JSON credentials.
/// - Parses the JSON response into [LoginResponse].
/// - Maps HTTP error codes to safe [AuthApiException] messages.
///
/// Does NOT:
/// - Store or manage JWT tokens.
/// - Decide Vendor/Admin authorization (deferred to AuthRepository).
/// - Handle navigation or UI state.
class AuthApiClient {
  /// Creates an [AuthApiClient].
  ///
  /// [client] can be injected for unit testing. If omitted, a default
  /// [http.Client] is created internally and will be disposed when
  /// [dispose] is called.
  ///
  /// The backend base URL is read from the compile-time environment variable
  /// `API_BASE_URL` via `--dart-define=API_BASE_URL=https://...`.
  AuthApiClient({http.Client? client})
      : _client = client,
        _ownsClient = client == null;

  http.Client? _client;
  final bool _ownsClient;
  bool _disposed = false;

  /// Compile-time backend base URL. Empty when not supplied.
  static const String _envBaseUrl = String.fromEnvironment('API_BASE_URL');

  /// Login endpoint path matching the FastAPI contract.
  static const String _loginPath = '/api/auth/login';

  /// HTTP request timeout.
  static const Duration _timeout = Duration(seconds: 20);

  /// Returns the effective HTTP client, creating one if needed.
  http.Client get _effectiveClient {
    if (_disposed) {
      throw StateError('AuthApiClient has been disposed.');
    }
    _client ??= http.Client();
    return _client!;
  }

  /// Resolves and validates the backend base URL.
  ///
  /// - Rejects empty or unset `API_BASE_URL`.
  /// - Rejects plain HTTP in release mode (asserts are stripped in release,
  ///   so the `kDebugMode`-equivalent check uses `assert`).
  Uri _resolveLoginUri() {
    if (_envBaseUrl.isEmpty) {
      throw const AuthApiException(
        'Backend API URL is not configured. '
        'Please set API_BASE_URL via --dart-define.',
      );
    }

    final uri = Uri.tryParse(_envBaseUrl);
    if (uri == null || !uri.hasScheme || uri.host.isEmpty) {
      throw const AuthApiException(
        'Backend API URL is invalid. Please check the API_BASE_URL configuration.',
      );
    }

    // In release builds, asserts are removed, so this block only runs in
    // debug/profile builds where localhost HTTP is acceptable for development.
    // In release builds the following line is a no-op; the URI scheme check
    // below enforces HTTPS for all non-assert code paths.
    assert(
      uri.scheme == 'https' || uri.scheme == 'http',
      'API_BASE_URL must use HTTPS (or HTTP for local debug only).',
    );

    // Enforce HTTPS in release builds. The `assert` above already warns in
    // debug. When asserts are stripped (release), we reject non-HTTPS.
    // We allow HTTP only when asserts are active (debug/profile).
    bool assertsEnabled = false;
    assert(() {
      assertsEnabled = true;
      return true;
    }());
    if (!assertsEnabled && uri.scheme != 'https') {
      throw const AuthApiException(
        'Insecure HTTP connections are not allowed in production. '
        'Please configure a secure HTTPS API_BASE_URL.',
      );
    }

    return Uri.parse('$_envBaseUrl$_loginPath');
  }

  /// Authenticates with the FastAPI backend.
  ///
  /// Sends a `POST /api/auth/login` request with the provided [request]
  /// credentials and returns the parsed [LoginResponse].
  ///
  /// Throws [AuthApiException] with a safe, user-facing message on failure.
  Future<LoginResponse> login(LoginRequest request) async {
    final uri = _resolveLoginUri();

    final http.Response response;

    try {
      response = await _effectiveClient
          .post(
            uri,
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: jsonEncode(request.toJson()),
          )
          .timeout(_timeout);
    } on TimeoutException {
      throw const AuthApiException(
        'Connection timed out. Please check your internet connection and try again.',
      );
    } on SocketException {
      throw const AuthApiException(
        'Unable to connect to the server. Please check your internet connection.',
      );
    } on http.ClientException {
      throw const AuthApiException(
        'A network error occurred. Please try again.',
      );
    } catch (_) {
      throw const AuthApiException(
        'An unexpected network error occurred. Please try again.',
      );
    }

    return _handleResponse(response);
  }

  /// Maps HTTP status codes to safe user-facing errors or parses the
  /// successful response.
  LoginResponse _handleResponse(http.Response response) {
    switch (response.statusCode) {
      case 200:
        return _parseSuccessResponse(response);
      case 401:
        throw const AuthApiException(
          'Invalid email or password. Please check your credentials.',
          statusCode: 401,
        );
      case 403:
        throw const AuthApiException(
          'Access denied. You do not have permission to log in.',
          statusCode: 403,
        );
      case 422:
        throw const AuthApiException(
          'Invalid login input. Please check your email and password format.',
          statusCode: 422,
        );
      case 429:
        throw const AuthApiException(
          'Too many login attempts. Please wait a moment and try again.',
          statusCode: 429,
        );
      default:
        if (response.statusCode >= 500) {
          throw AuthApiException(
            'The authentication service is temporarily unavailable. Please try again shortly.',
            statusCode: response.statusCode,
          );
        }
        throw AuthApiException(
          'Login failed. Please try again.',
          statusCode: response.statusCode,
        );
    }
  }

  /// Decodes and validates the JSON response body into a [LoginResponse].
  LoginResponse _parseSuccessResponse(http.Response response) {
    final Map<String, dynamic> json;

    try {
      final decoded = jsonDecode(response.body);
      if (decoded is! Map<String, dynamic>) {
        throw const AuthApiException(
          'Received an unexpected response from the server.',
        );
      }
      json = decoded;
    } on FormatException {
      throw const AuthApiException(
        'Received an invalid response from the server.',
      );
    }

    try {
      return LoginResponse.fromJson(json);
    } on FormatException catch (e) {
      throw AuthApiException(
        e.message.isNotEmpty
            ? e.message
            : 'Received an invalid response from the server.',
      );
    }
  }

  /// Disposes the internally-created HTTP client.
  ///
  /// If an external client was injected, it is NOT closed here; the caller
  /// retains ownership.
  void dispose() {
    if (_ownsClient) {
      _client?.close();
    }
    _client = null;
    _disposed = true;
  }
}
