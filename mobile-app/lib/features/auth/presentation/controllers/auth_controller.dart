
// ignore_for_file: prefer_initializing_formals

import 'package:flutter/foundation.dart';

import '../../data/models/auth_models.dart';
import '../../data/repositories/auth_repository.dart';

enum AuthStatus {
  initial,
  loading,
  authenticated,
  error,
}

class AuthController extends ChangeNotifier {
  AuthController({required AuthRepository repository})
      : _repository = repository;

  final AuthRepository _repository;

  AuthStatus _status = AuthStatus.initial;
  AuthUser? _user;
  String? _errorMessage;

  AuthStatus get status => _status;
  AuthUser? get user => _user;
  String? get errorMessage => _errorMessage;
  bool get isLoading => _status == AuthStatus.loading;

  Future<AuthResult> login(
    String email,
    String password,
  ) async {
    if (_status == AuthStatus.loading) {
      return AuthResult.failure(
        'Login is already in progress.',
      );
    }

    _status = AuthStatus.loading;
    _errorMessage = null;
    _user = null;
    notifyListeners();

    final result = await _repository.login(email, password);

    if (result.isSuccess) {
      _status = AuthStatus.authenticated;
      _user = result.user;
      _errorMessage = null;
    } else {
      _status = AuthStatus.error;
      _user = null;
      _errorMessage = result.errorMessage;
    }

    notifyListeners();
    return result;
  }

  Future<bool> logout() async {
    final success = await _repository.logout();

    if (!success) {
      _errorMessage =
          'Could not securely sign out. Please try again.';
      notifyListeners();
      return false;
    }

    _status = AuthStatus.initial;
    _user = null;
    _errorMessage = null;

    notifyListeners();
    return true;
  }

  @override
  void dispose() {
    _repository.dispose();
    super.dispose();
  }
}
