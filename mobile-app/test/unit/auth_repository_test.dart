import 'package:flutter_test/flutter_test.dart';

import 'package:ceylongo_mobile/features/auth/data/datasources/auth_api_client.dart';
import 'package:ceylongo_mobile/features/auth/data/models/auth_models.dart';
import 'package:ceylongo_mobile/features/auth/data/repositories/auth_repository.dart';
import 'package:ceylongo_mobile/core/storage/secure_storage_service.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';

// ─── Fake SecureStorage ───────────────────────────────────────────────────────

class FakeSecureStorage extends FlutterSecureStorage {
  final Map<String, String> data = {};
  bool throwOnWrite = false;
  bool throwOnDelete = false;

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
    if (throwOnWrite) throw Exception('Write failed');
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
  }) async {
    return data[key];
  }

  @override
  Future<void> delete({
    required String key,
    IOSOptions? iOptions,
    AndroidOptions? aOptions,
    LinuxOptions? lOptions,
    WebOptions? webOptions,
    MacOsOptions? mOptions,
    WindowsOptions? wOptions,
  }) async {
    if (throwOnDelete) throw Exception('Delete failed');
    data.remove(key);
  }

  @override
  Future<void> deleteAll({
    IOSOptions? iOptions,
    AndroidOptions? aOptions,
    LinuxOptions? lOptions,
    WebOptions? webOptions,
    MacOsOptions? mOptions,
    WindowsOptions? wOptions,
  }) async {
    data.clear();
  }

  @override
  Future<bool> containsKey({
    required String key,
    IOSOptions? iOptions,
    AndroidOptions? aOptions,
    LinuxOptions? lOptions,
    WebOptions? webOptions,
    MacOsOptions? mOptions,
    WindowsOptions? wOptions,
  }) async {
    return data.containsKey(key);
  }

  @override
  Future<Map<String, String>> readAll({
    IOSOptions? iOptions,
    AndroidOptions? aOptions,
    LinuxOptions? lOptions,
    WebOptions? webOptions,
    MacOsOptions? mOptions,
    WindowsOptions? wOptions,
  }) async {
    return Map.from(data);
  }
}

// ─── Fake AuthApiClient for unit testing without network ──────────────────────

class FakeAuthApiClient extends AuthApiClient {
  FakeAuthApiClient() : super(client: MockClient((_) async => http.Response('', 200)));

  LoginResponse? responseToReturn;
  AuthApiException? exceptionToThrow;

  @override
  Future<LoginResponse> login(LoginRequest request) async {
    if (exceptionToThrow != null) {
      throw exceptionToThrow!;
    }
    return responseToReturn!;
  }
}

// ─── Test Helpers ─────────────────────────────────────────────────────────────

Map<String, dynamic> _vendorUserJson() => {
      'id': 1,
      'name': 'Test Vendor',
      'email': 'vendor@ceylongo.lk',
      'role': 'Vendor',
    };

Map<String, dynamic> _adminUserJson() => {
      'id': 2,
      'name': 'Test Admin',
      'email': 'admin@ceylongo.lk',
      'role': 'Admin',
    };

Map<String, dynamic> _touristUserJson() => {
      'id': 3,
      'name': 'Test Tourist',
      'email': 'tourist@ceylongo.lk',
      'role': 'Tourist',
    };

LoginResponse _makeResponse(Map<String, dynamic> userJson) {
  return LoginResponse(
    accessToken: 'test.jwt.token',
    tokenType: 'bearer',
    expiresIn: 1800,
    user: AuthUser.fromJson(userJson),
  );
}

// ─── Tests ────────────────────────────────────────────────────────────────────

void main() {
  group('AuthRepository Tests', () {
    late FakeAuthApiClient fakeApi;
    late FakeSecureStorage fakeStorage;
    late SecureStorageService storageService;
    late AuthRepository repository;

    setUp(() {
      fakeApi = FakeAuthApiClient();
      fakeStorage = FakeSecureStorage();
      storageService = SecureStorageService(storage: fakeStorage);
      repository = AuthRepository(
        apiClient: fakeApi,
        storageService: storageService,
      );
    });

    test('1. Successful Vendor login stores session and returns user', () async {
      fakeApi.responseToReturn = _makeResponse(_vendorUserJson());

      final result = await repository.login('vendor@ceylongo.lk', 'password123');

      expect(result.isSuccess, isTrue);
      expect(result.user!.isVendor, isTrue);
      expect(result.user!.name, 'Test Vendor');
      expect(
        fakeStorage.data.containsKey(SecureStorageService.keyAccessToken),
        isTrue,
      );
    });

    test('2. Successful Admin login stores session and returns user', () async {
      fakeApi.responseToReturn = _makeResponse(_adminUserJson());

      final result = await repository.login('admin@ceylongo.lk', 'password123');

      expect(result.isSuccess, isTrue);
      expect(result.user!.isAdmin, isTrue);
      expect(result.user!.name, 'Test Admin');
    });

    test('3. Tourist role is rejected with descriptive message', () async {
      fakeApi.responseToReturn = _makeResponse(_touristUserJson());

      final result = await repository.login('tourist@ceylongo.lk', 'password123');

      expect(result.isSuccess, isFalse);
      expect(result.errorMessage, contains('Vendor and Admin'));
      // Should NOT store session for rejected role
      expect(
        fakeStorage.data.containsKey(SecureStorageService.keyAccessToken),
        isFalse,
      );
    });

    test('4. API error is captured and returned as AuthResult failure', () async {
      fakeApi.exceptionToThrow = const AuthApiException(
        'Invalid email or password.',
        statusCode: 401,
      );

      final result = await repository.login('wrong@email.com', 'wrongpass');

      expect(result.isSuccess, isFalse);
      expect(result.errorMessage, contains('Invalid email or password'));
    });

    test('5. Unexpected errors are caught and produce safe message', () async {
      fakeApi.exceptionToThrow = null;
      fakeApi.responseToReturn = null;
      // This will cause a null dereference, simulating an unexpected error

      final result = await repository.login('test@test.com', 'pass123');

      expect(result.isSuccess, isFalse);
      expect(result.errorMessage, contains('unexpected'));
    });

    test('6. Logout clears session successfully', () async {
      fakeApi.responseToReturn = _makeResponse(_vendorUserJson());
      await repository.login('vendor@ceylongo.lk', 'password123');
      expect(fakeStorage.data.isNotEmpty, isTrue);

      final loggedOut = await repository.logout();
      expect(loggedOut, isTrue);
      expect(
        fakeStorage.data.containsKey(SecureStorageService.keyAccessToken),
        isFalse,
      );
    });

    test('7. Logout returns false when storage fails', () async {
      fakeStorage.throwOnDelete = true;

      final loggedOut = await repository.logout();
      expect(loggedOut, isFalse);
    });

    test('8. hasValidSession returns true after login', () async {
      fakeApi.responseToReturn = _makeResponse(_vendorUserJson());
      await repository.login('vendor@ceylongo.lk', 'password123');

      final hasSession = await repository.hasValidSession();
      expect(hasSession, isTrue);
    });

    test('9. hasValidSession returns false when no session exists', () async {
      final hasSession = await repository.hasValidSession();
      expect(hasSession, isFalse);
    });
  });
}
