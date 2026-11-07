import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:ceylongo_mobile/core/storage/secure_storage_service.dart';

/// Test double simulating [FlutterSecureStorage] with controlled failure modes.
class FakeFlutterSecureStorage extends FlutterSecureStorage {
  FakeFlutterSecureStorage({
    this.throwOnRead = false,
    this.throwOnWrite = false,
    this.throwOnDelete = false,
    this.throwOnDeleteKey,
    this.throwOnWriteKey,
  });

  final Map<String, String> data = {};
  bool throwOnRead;
  bool throwOnWrite;
  bool throwOnDelete;
  String? throwOnDeleteKey;
  String? throwOnWriteKey;
  bool deleteAllCalled = false;
  final List<String> deletedKeys = [];

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
    if (throwOnWrite || throwOnWriteKey == key) {
      throw Exception('Simulated secure storage write failure');
    }
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
    if (throwOnRead) {
      throw Exception('Simulated secure storage read failure');
    }
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
    deletedKeys.add(key);
    if (throwOnDelete || throwOnDeleteKey == key) {
      throw Exception('Simulated secure storage delete failure for key $key');
    }
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
    deleteAllCalled = true;
    data.clear();
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
}

void main() {
  const dummyToken = 'mock_jwt_header.mock_jwt_payload.mock_signature';

  group('SecureStorageService - Session Storage and Validation', () {
    late FakeFlutterSecureStorage fakeStorage;
    late SecureStorageService service;

    setUp(() {
      fakeStorage = FakeFlutterSecureStorage();
      service = SecureStorageService(storage: fakeStorage);
    });

    test('1. Saves a valid session with calculated UTC expiration', () async {
      await service.saveSession(dummyToken, 1800);

      expect(fakeStorage.data[SecureStorageService.keyAccessToken], dummyToken);
      expect(fakeStorage.data.containsKey(SecureStorageService.keyExpiresAt), isTrue);

      final expiresAt = DateTime.parse(fakeStorage.data[SecureStorageService.keyExpiresAt]!);
      final now = DateTime.now().toUtc();
      expect(expiresAt.isAfter(now), isTrue);
      // Validates expiration is approximately 1800 seconds in the future
      expect(expiresAt.difference(now).inSeconds, inInclusiveRange(1790, 1800));
    });

    test('2. Rejects empty or whitespace-only access token', () async {
      expect(() => service.saveSession('', 1800), throwsArgumentError);
      expect(() => service.saveSession('   ', 1800), throwsArgumentError);
      expect(fakeStorage.data.isEmpty, isTrue);
    });

    test('3. Rejects invalid expiresIn values', () async {
      expect(() => service.saveSession(dummyToken, 0), throwsArgumentError);
      expect(() => service.saveSession(dummyToken, -10), throwsArgumentError);
      expect(() => service.saveSession(dummyToken, 1801), throwsArgumentError);
      expect(fakeStorage.data.isEmpty, isTrue);
    });

    test('4. Reads a valid, unexpired access token successfully', () async {
      await service.saveSession(dummyToken, 1800);

      final token = await service.readValidAccessToken();
      expect(token, dummyToken);
    });

    test('5. Rejects expired sessions and purges stored authentication keys', () async {
      // Manually store an expired timestamp in the past
      fakeStorage.data[SecureStorageService.keyAccessToken] = dummyToken;
      fakeStorage.data[SecureStorageService.keyExpiresAt] =
          DateTime.now().toUtc().subtract(const Duration(minutes: 5)).toIso8601String();

      final token = await service.readValidAccessToken();

      expect(token, isNull);
      expect(fakeStorage.data.containsKey(SecureStorageService.keyAccessToken), isFalse);
      expect(fakeStorage.data.containsKey(SecureStorageService.keyExpiresAt), isFalse);
    });

    test('6. Handles invalid expiration metadata by purging keys and returning null', () async {
      // Malformed date string
      fakeStorage.data[SecureStorageService.keyAccessToken] = dummyToken;
      fakeStorage.data[SecureStorageService.keyExpiresAt] = 'not_a_valid_date';

      final token = await service.readValidAccessToken();

      expect(token, isNull);
      expect(fakeStorage.data.containsKey(SecureStorageService.keyAccessToken), isFalse);
      expect(fakeStorage.data.containsKey(SecureStorageService.keyExpiresAt), isFalse);
    });

    test('7. Clears only module-owned keys and preserves unrelated app storage', () async {
      fakeStorage.data[SecureStorageService.keyAccessToken] = dummyToken;
      fakeStorage.data[SecureStorageService.keyExpiresAt] =
          DateTime.now().toUtc().add(const Duration(minutes: 10)).toIso8601String();
      fakeStorage.data['other_unrelated_setting'] = 'custom_value';

      await service.clearSession();

      expect(fakeStorage.data.containsKey(SecureStorageService.keyAccessToken), isFalse);
      expect(fakeStorage.data.containsKey(SecureStorageService.keyExpiresAt), isFalse);
      expect(fakeStorage.data['other_unrelated_setting'], 'custom_value');
      expect(fakeStorage.deleteAllCalled, isFalse);
    });

    test('8. Handles storage write failures safely and leaves no partial state', () async {
      // Simulate failure on writing the second key
      fakeStorage.throwOnWriteKey = SecureStorageService.keyAccessToken;

      await expectLater(
        service.saveSession(dummyToken, 900),
        throwsA(isA<Exception>()),
      );

      // Verify no partial state remains in storage
      expect(fakeStorage.data.containsKey(SecureStorageService.keyAccessToken), isFalse);
      expect(fakeStorage.data.containsKey(SecureStorageService.keyExpiresAt), isFalse);
    });

    test('9. Handles storage read failures safely without throwing to caller', () async {
      fakeStorage.throwOnRead = true;

      final token = await service.readValidAccessToken();
      expect(token, isNull);
    });

    test('10. Handles deletion failure without claiming success and attempts both keys', () async {
      // Simulate failure deleting the first key (keyAccessToken)
      fakeStorage.throwOnDeleteKey = SecureStorageService.keyAccessToken;

      await expectLater(
        service.clearSession(),
        throwsA(isA<Exception>()),
      );

      // Verify deletion was attempted for BOTH keys despite first failure
      expect(fakeStorage.deletedKeys, contains(SecureStorageService.keyAccessToken));
      expect(fakeStorage.deletedKeys, contains(SecureStorageService.keyExpiresAt));
    });
  });
}
