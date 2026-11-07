
import 'package:flutter/material.dart';

import 'core/storage/secure_storage_service.dart';
import 'core/theme/app_theme.dart';
import 'features/auth/data/datasources/auth_api_client.dart';
import 'features/auth/data/models/auth_models.dart';
import 'features/auth/data/repositories/auth_repository.dart';
import 'features/auth/presentation/controllers/auth_controller.dart';
import 'features/auth/presentation/screens/admin_home_screen.dart';
import 'features/auth/presentation/screens/login_screen.dart';
import 'features/auth/presentation/screens/vendor_home_screen.dart';

void main() {
  runApp(const CeylonGoApp());
}

class CeylonGoApp extends StatefulWidget {
  const CeylonGoApp({super.key});

  @override
  State<CeylonGoApp> createState() => _CeylonGoAppState();
}

class _CeylonGoAppState extends State<CeylonGoApp> {
  final GlobalKey<NavigatorState> _navigatorKey =
      GlobalKey<NavigatorState>();

  final GlobalKey<ScaffoldMessengerState> _messengerKey =
      GlobalKey<ScaffoldMessengerState>();

  late final AuthRepository _authRepository;
  late final AuthController _authController;

  @override
  void initState() {
    super.initState();

    _authRepository = AuthRepository(
      apiClient: AuthApiClient(),
      storageService: SecureStorageService(),
    );

    _authController = AuthController(
      repository: _authRepository,
    );
  }

  void _onLoginSuccess(AuthUser user) {
    if (!mounted || !user.isAllowedOnMobile) {
      return;
    }

    final Widget homeScreen;

    if (user.isAdmin) {
      homeScreen = AdminHomeScreen(
        userName: user.name,
        onLogout: _handleLogout,
      );
    } else {
      homeScreen = VendorHomeScreen(
        userName: user.name,
        onLogout: _handleLogout,
      );
    }

    _navigatorKey.currentState?.pushReplacement(
      MaterialPageRoute<void>(
        builder: (_) => homeScreen,
      ),
    );
  }

  Future<void> _handleLogout() async {
    final success = await _authController.logout();

    if (!mounted) {
      return;
    }

    if (!success) {
      _messengerKey.currentState?.showSnackBar(
        const SnackBar(
          content: Text(
            'Could not securely sign out. Please try again.',
          ),
        ),
      );
      return;
    }

    _navigatorKey.currentState?.pushAndRemoveUntil(
      MaterialPageRoute<void>(
        builder: (_) => LoginScreen(
          authController: _authController,
          onLoginSuccess: _onLoginSuccess,
        ),
      ),
      (route) => false,
    );
  }

  @override
  void dispose() {
    _authController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'CeylonGo',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      navigatorKey: _navigatorKey,
      scaffoldMessengerKey: _messengerKey,
      home: LoginScreen(
        authController: _authController,
        onLoginSuccess: _onLoginSuccess,
      ),
    );
  }
}
