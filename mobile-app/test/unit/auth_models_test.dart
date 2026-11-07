
import 'package:flutter_test/flutter_test.dart';
import 'package:ceylongo_mobile/features/auth/data/models/auth_models.dart';

void main() {
  Map<String, dynamic> validResponse() {
    return {
      'access_token': 'test.header.signature',
      'token_type': 'bearer',
      'expires_in': 1800,
      'user': <String, dynamic>{
        'id': 1,
        'name': 'Test Vendor',
        'email': 'vendor@example.com',
        'role': 'Vendor',
      },
    };
  }

  group('LoginRequest Tests', () {
    test('1. Converts email and password to correct JSON', () {
      const request = LoginRequest(
        email: ' vendor@example.com ',
        password: 'TestPassword123',
      );

      final json = request.toJson();

      expect(json['email'], 'vendor@example.com');
      expect(json['password'], 'TestPassword123');
    });
  });

  group('AuthUser Tests', () {
    test('2. Accepts Vendor role', () {
      final user = AuthUser.fromJson(
        validResponse()['user'] as Map<String, dynamic>,
      );

      expect(user.id, 1);
      expect(user.isVendor, isTrue);
      expect(user.isAllowedOnMobile, isTrue);
    });

    test('3. Accepts Admin role', () {
      final json =
          validResponse()['user'] as Map<String, dynamic>;

      json['role'] = 'Admin';

      final user = AuthUser.fromJson(json);

      expect(user.isAdmin, isTrue);
      expect(user.isAllowedOnMobile, isTrue);
    });

    test('4. Parses Tourist but does not allow mobile access', () {
      final json =
          validResponse()['user'] as Map<String, dynamic>;

      json['role'] = 'Tourist';

      final user = AuthUser.fromJson(json);

      expect(user.role, 'Tourist');
      expect(user.isAllowedOnMobile, isFalse);
    });

    test('5. Rejects invalid user IDs', () {
      for (final invalidId in <dynamic>[0, -1, '1', null]) {
        final json =
            validResponse()['user'] as Map<String, dynamic>;

        json['id'] = invalidId;

        expect(
          () => AuthUser.fromJson(json),
          throwsFormatException,
        );
      }
    });

    test('6. Rejects unsupported roles', () {
      final json =
          validResponse()['user'] as Map<String, dynamic>;

      json['role'] = 'Unknown';

      expect(
        () => AuthUser.fromJson(json),
        throwsFormatException,
      );
    });

    test('7. Rejects missing user name and email', () {
      final json =
          validResponse()['user'] as Map<String, dynamic>;

      json['name'] = '';

      expect(
        () => AuthUser.fromJson(json),
        throwsFormatException,
      );

      json['name'] = 'Test Vendor';
      json['email'] = null;

      expect(
        () => AuthUser.fromJson(json),
        throwsFormatException,
      );
    });
  });

  group('LoginResponse Tests', () {
    test('8. Parses a valid FastAPI login response', () {
      final response = LoginResponse.fromJson(validResponse());

      expect(response.accessToken, 'test.header.signature');
      expect(response.tokenType, 'bearer');
      expect(response.expiresIn, 1800);
      expect(response.user.isVendor, isTrue);
    });

    test('9. Rejects an empty access token', () {
      final json = validResponse();
      json['access_token'] = '';

      expect(
        () => LoginResponse.fromJson(json),
        throwsFormatException,
      );
    });

    test('10. Rejects incorrect token type', () {
      final json = validResponse();
      json['token_type'] = 'basic';

      expect(
        () => LoginResponse.fromJson(json),
        throwsFormatException,
      );
    });

    test('11. Rejects invalid token expiration', () {
      for (final invalidExpiry
          in <dynamic>[0, -10, 1801, '1800', null]) {
        final json = validResponse();
        json['expires_in'] = invalidExpiry;

        expect(
          () => LoginResponse.fromJson(json),
          throwsFormatException,
        );
      }
    });

    test('12. Rejects invalid user response', () {
      final json = validResponse();
      json['user'] = null;

      expect(
        () => LoginResponse.fromJson(json),
        throwsFormatException,
      );
    });
  });
}
