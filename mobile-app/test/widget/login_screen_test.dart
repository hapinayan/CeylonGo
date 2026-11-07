import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:ceylongo_mobile/features/auth/data/datasources/auth_api_client.dart';
import 'package:ceylongo_mobile/features/auth/data/models/auth_models.dart';
import 'package:ceylongo_mobile/features/auth/data/repositories/auth_repository.dart';
import 'package:ceylongo_mobile/features/auth/presentation/controllers/auth_controller.dart';
import 'package:ceylongo_mobile/features/auth/presentation/screens/login_screen.dart';
import 'package:ceylongo_mobile/core/theme/app_theme.dart';
import 'package:ceylongo_mobile/core/storage/secure_storage_service.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';

// ─── Fakes ────────────────────────────────────────────────────────────────────

class FakeStorageForWidget extends FlutterSecureStorage {
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

class FakeApiForWidget extends AuthApiClient {
  FakeApiForWidget()
      : super(client: MockClient((_) async => http.Response('', 200)));

  LoginResponse? responseToReturn;
  AuthApiException? exceptionToThrow;
  int loginCallCount = 0;

  @override
  Future<LoginResponse> login(LoginRequest request) async {
    loginCallCount++;
    // Simulate network delay
    await Future<void>.delayed(const Duration(milliseconds: 50));
    if (exceptionToThrow != null) throw exceptionToThrow!;
    return responseToReturn!;
  }
}

// ─── Widget Test Helpers ──────────────────────────────────────────────────────

Widget _buildTestApp({
  required AuthController controller,
  required void Function(AuthUser) onLoginSuccess,
}) {
  return MaterialApp(
    theme: AppTheme.lightTheme,
    home: LoginScreen(
      authController: controller,
      onLoginSuccess: onLoginSuccess,
    ),
  );
}

// ─── Tests ────────────────────────────────────────────────────────────────────

void main() {
  group('LoginScreen Widget Tests', () {
    late FakeApiForWidget fakeApi;
    late AuthController controller;
    AuthUser? capturedUser;

    setUp(() {
      fakeApi = FakeApiForWidget();
      final storageService = SecureStorageService(
        storage: FakeStorageForWidget(),
      );
      final repository = AuthRepository(
        apiClient: fakeApi,
        storageService: storageService,
      );
      controller = AuthController(repository: repository);
      capturedUser = null;
    });

    tearDown(() {
      controller.dispose();
    });

    testWidgets('1. Renders login form with all essential fields', (tester) async {
      await tester.pumpWidget(_buildTestApp(
        controller: controller,
        onLoginSuccess: (u) => capturedUser = u,
      ));

      // CeylonGo branding
      expect(find.text('CeylonGo'), findsOneWidget);
      expect(find.text('Vendor & Admin Portal'), findsOneWidget);

      // Form fields
      expect(find.byKey(const Key('email_field')), findsOneWidget);
      expect(find.byKey(const Key('password_field')), findsOneWidget);
      expect(find.byKey(const Key('login_button')), findsOneWidget);

      // Password is obscured by default — check the underlying EditableText
      final editableText = tester.widget<EditableText>(
        find.descendant(
          of: find.byKey(const Key('password_field')),
          matching: find.byType(EditableText),
        ),
      );
      expect(editableText.obscureText, isTrue);
    });

    testWidgets('2. Toggle password visibility works', (tester) async {
      await tester.pumpWidget(_buildTestApp(
        controller: controller,
        onLoginSuccess: (u) => capturedUser = u,
      ));

      // Initially obscured — check via EditableText
      var editableText = tester.widget<EditableText>(
        find.descendant(
          of: find.byKey(const Key('password_field')),
          matching: find.byType(EditableText),
        ),
      );
      expect(editableText.obscureText, isTrue);

      // Tap the toggle button
      await tester.tap(find.byKey(const Key('toggle_password')));
      await tester.pump();

      // Now visible
      editableText = tester.widget<EditableText>(
        find.descendant(
          of: find.byKey(const Key('password_field')),
          matching: find.byType(EditableText),
        ),
      );
      expect(editableText.obscureText, isFalse);
    });

    testWidgets('3. Empty email shows validation error', (tester) async {
      await tester.pumpWidget(_buildTestApp(
        controller: controller,
        onLoginSuccess: (u) => capturedUser = u,
      ));

      // Tap login without entering anything
      await tester.tap(find.byKey(const Key('login_button')));
      await tester.pumpAndSettle();

      expect(find.text('Please enter your email address'), findsOneWidget);
    });

    testWidgets('4. Invalid email shows validation error', (tester) async {
      await tester.pumpWidget(_buildTestApp(
        controller: controller,
        onLoginSuccess: (u) => capturedUser = u,
      ));

      await tester.enterText(
        find.byKey(const Key('email_field')),
        'not-an-email',
      );
      await tester.enterText(
        find.byKey(const Key('password_field')),
        'password123',
      );

      await tester.tap(find.byKey(const Key('login_button')));
      await tester.pumpAndSettle();

      expect(find.text('Please enter a valid email address'), findsOneWidget);
    });

    testWidgets('5. Short password shows validation error', (tester) async {
      await tester.pumpWidget(_buildTestApp(
        controller: controller,
        onLoginSuccess: (u) => capturedUser = u,
      ));

      await tester.enterText(
        find.byKey(const Key('email_field')),
        'test@example.com',
      );
      await tester.enterText(
        find.byKey(const Key('password_field')),
        '12345',
      );

      await tester.tap(find.byKey(const Key('login_button')));
      await tester.pumpAndSettle();

      expect(find.text('Password must be at least 6 characters'), findsOneWidget);
    });

    testWidgets('6. Successful login calls onLoginSuccess', (tester) async {
      fakeApi.responseToReturn = LoginResponse(
        accessToken: 'test.jwt.token',
        tokenType: 'bearer',
        expiresIn: 1800,
        user: AuthUser.fromJson({
          'id': 1,
          'name': 'Test Vendor',
          'email': 'vendor@ceylongo.lk',
          'role': 'Vendor',
        }),
      );

      await tester.pumpWidget(_buildTestApp(
        controller: controller,
        onLoginSuccess: (u) => capturedUser = u,
      ));

      await tester.enterText(
        find.byKey(const Key('email_field')),
        'vendor@ceylongo.lk',
      );
      await tester.enterText(
        find.byKey(const Key('password_field')),
        'password123',
      );

      await tester.tap(find.byKey(const Key('login_button')));
      await tester.pumpAndSettle();

      expect(capturedUser, isNotNull);
      expect(capturedUser!.name, 'Test Vendor');
      expect(capturedUser!.isVendor, isTrue);
    });

    testWidgets('7. Failed login shows error message', (tester) async {
      fakeApi.exceptionToThrow = const AuthApiException(
        'Invalid email or password. Please check your credentials.',
        statusCode: 401,
      );

      await tester.pumpWidget(_buildTestApp(
        controller: controller,
        onLoginSuccess: (u) => capturedUser = u,
      ));

      await tester.enterText(
        find.byKey(const Key('email_field')),
        'wrong@ceylongo.lk',
      );
      await tester.enterText(
        find.byKey(const Key('password_field')),
        'wrongpassword',
      );

      await tester.tap(find.byKey(const Key('login_button')));
      await tester.pumpAndSettle();

      expect(capturedUser, isNull);
      expect(
        find.text('Invalid email or password. Please check your credentials.'),
        findsOneWidget,
      );
    });

    testWidgets('8. Loading indicator appears during login', (tester) async {
      fakeApi.responseToReturn = LoginResponse(
        accessToken: 'test.jwt.token',
        tokenType: 'bearer',
        expiresIn: 1800,
        user: AuthUser.fromJson({
          'id': 1,
          'name': 'Test',
          'email': 't@test.com',
          'role': 'Vendor',
        }),
      );

      await tester.pumpWidget(_buildTestApp(
        controller: controller,
        onLoginSuccess: (u) => capturedUser = u,
      ));

      await tester.enterText(
        find.byKey(const Key('email_field')),
        't@test.com',
      );
      await tester.enterText(
        find.byKey(const Key('password_field')),
        'password123',
      );

      await tester.tap(find.byKey(const Key('login_button')));
      // Pump once to trigger loading state (not pumpAndSettle)
      await tester.pump();

      expect(find.byType(CircularProgressIndicator), findsOneWidget);

      // Let it complete
      await tester.pumpAndSettle();
    });
  });
}
