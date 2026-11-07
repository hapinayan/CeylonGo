import 'package:flutter_test/flutter_test.dart';

import 'package:ceylongo_mobile/features/auth/data/datasources/auth_api_client.dart';
import 'package:ceylongo_mobile/features/auth/data/models/auth_models.dart';
import 'package:ceylongo_mobile/features/auth/data/repositories/auth_repository.dart';
import 'package:ceylongo_mobile/features/auth/presentation/controllers/auth_controller.dart';
import 'package:ceylongo_mobile/core/storage/secure_storage_service.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';

// ─── Minimal Fakes ───────────────────────────────────────────────────────────

class FakeSecureStorageForController extends FlutterSecureStorage {
  final Map<String, String> data = {};

  @override
  Future<void> write({
    required String key,
    required String? value,
    IOSOptions? iOptions,
    AndroidOptions? aOptions,
    LinuxOptions? lOptions,
    WebOptions? webOptions,
    MacOsOptions? mOptions,
    WindowsOptions? wOptions,
  }) async {
    if (value != null) {
      data[key] = value;
    } else {
      data.remove(key);
    }
  }

  @override
  Future<String?> read({
    required String key,
    IOSOptions? iOptions,
    AndroidOptions? aOptions,
    LinuxOptions? lOptions,
    WebOptions? webOptions,
    MacOsOptions? mOptions,
    WindowsOptions? wOptions,
  }) async => data[key];

  @override
  Future<void> delete({
    required String key,
    IOSOptions? iOptions,
    AndroidOptions? aOptions,
    LinuxOptions? lOptions,
    WebOptions? webOptions,
    MacOsOptions? mOptions,
    WindowsOptions? wOptions,
  }) async => data.remove(key);

  @override
  Future<void> deleteAll({
    IOSOptions? iOptions,
    AndroidOptions? aOptions,
    LinuxOptions? lOptions,
    WebOptions? webOptions,
    MacOsOptions? mOptions,
    WindowsOptions? wOptions,
  }) async => data.clear();

  @override
  Future<bool> containsKey({
    required String key,
    IOSOptions? iOptions,
    AndroidOptions? aOptions,
    LinuxOptions? lOptions,
    WebOptions? webOptions,
    MacOsOptions? mOptions,
    WindowsOptions? wOptions,
  }) async => data.containsKey(key);

  @override
  Future<Map<String, String>> readAll({
    IOSOptions? iOptions,
    AndroidOptions? aOptions,
    LinuxOptions? lOptions,
    WebOptions? webOptions,
    MacOsOptions? mOptions,
    WindowsOptions? wOptions,
  }) async => Map.from(data);
}

class FakeApiClientForController extends AuthApiClient {
  FakeApiClientForController()
      : super(client: MockClient((_) async => http.Response('', 200)));

  LoginResponse? responseToReturn;
  AuthApiException? exceptionToThrow;

  @override
  Future<LoginResponse> login(LoginRequest request) async {
    if (exceptionToThrow != null) throw exceptionToThrow!;
    return responseToReturn!;
  }
}

// ─── Tests ────────────────────────────────────────────────────────────────────

void main() {
  group('AuthController Tests', () {
    late FakeApiClientForController fakeApi;
    late SecureStorageService storageService;
    late AuthRepository repository;
    late AuthController controller;

    setUp(() {
      fakeApi = FakeApiClientForController();
      storageService = SecureStorageService(
        storage: FakeSecureStorageForController(),
      );
      repository = AuthRepository(
        apiClient: fakeApi,
        storageService: storageService,
      );
      controller = AuthController(repository: repository);
    });

    tearDown(() {
      controller.dispose();
    });

    test('1. Initial state is AuthStatus.initial', () {
      expect(controller.status, AuthStatus.initial);
      expect(controller.user, isNull);
      expect(controller.errorMessage, isNull);
      expect(controller.isLoading, isFalse);
    });

    test('2. Successful login transitions to authenticated', () async {
      fakeApi.responseToReturn = LoginResponse(
        accessToken: 'test.jwt.token',
        tokenType: 'bearer',
        expiresIn: 1800,
        user: AuthUser.fromJson({
          'id': 1,
          'name': 'Vendor User',
          'email': 'vendor@ceylongo.lk',
          'role': 'Vendor',
        }),
      );

      // Track state transitions
      final states = <AuthStatus>[];
      controller.addListener(() => states.add(controller.status));

      final result = await controller.login('vendor@ceylongo.lk', 'password');

      expect(result.isSuccess, isTrue);
      expect(controller.status, AuthStatus.authenticated);
      expect(controller.user!.name, 'Vendor User');
      expect(controller.errorMessage, isNull);
      // Should have gone through loading -> authenticated
      expect(states, contains(AuthStatus.loading));
      expect(states, contains(AuthStatus.authenticated));
    });

    test('3. Failed login transitions to error with message', () async {
      fakeApi.exceptionToThrow = const AuthApiException(
        'Invalid email or password.',
        statusCode: 401,
      );

      final result = await controller.login('bad@email.com', 'wrong');

      expect(result.isSuccess, isFalse);
      expect(controller.status, AuthStatus.error);
      expect(controller.user, isNull);
      expect(controller.errorMessage, contains('Invalid email or password'));
    });

    test('4. Logout resets to initial state', () async {
      fakeApi.responseToReturn = LoginResponse(
        accessToken: 'test.jwt.token',
        tokenType: 'bearer',
        expiresIn: 1800,
        user: AuthUser.fromJson({
          'id': 1,
          'name': 'Vendor',
          'email': 'v@test.com',
          'role': 'Vendor',
        }),
      );

      await controller.login('v@test.com', 'password');
      expect(controller.status, AuthStatus.authenticated);

      await controller.logout();
      expect(controller.status, AuthStatus.initial);
      expect(controller.user, isNull);
      expect(controller.errorMessage, isNull);
    });

    test('5. isLoading is true during login and false after', () async {
      bool wasLoading = false;
      controller.addListener(() {
        if (controller.isLoading) wasLoading = true;
      });

      fakeApi.responseToReturn = LoginResponse(
        accessToken: 'test.jwt.token',
        tokenType: 'bearer',
        expiresIn: 1800,
        user: AuthUser.fromJson({
          'id': 1,
          'name': 'Admin',
          'email': 'a@test.com',
          'role': 'Admin',
        }),
      );

      await controller.login('a@test.com', 'password');

      expect(wasLoading, isTrue);
      expect(controller.isLoading, isFalse);
    });
  });
}
