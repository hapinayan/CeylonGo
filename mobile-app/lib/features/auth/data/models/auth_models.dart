
class LoginRequest {
  const LoginRequest({
    required this.email,
    required this.password,
  });

  final String email;
  final String password;

  Map<String, dynamic> toJson() => {
        'email': email.trim(),
        'password': password,
      };
}

class AuthUser {
  const AuthUser({
    required this.id,
    required this.name,
    required this.email,
    required this.role,
  });

  final int id;
  final String name;
  final String email;
  final String role;

  bool get isVendor => role == 'Vendor';
  bool get isAdmin => role == 'Admin';
  bool get isAllowedOnMobile => isVendor || isAdmin;

  factory AuthUser.fromJson(Map<String, dynamic> json) {
    final id = json['id'];
    final name = json['name'];
    final email = json['email'];
    final role = json['role'];

    if (id is! int || id <= 0) {
      throw const FormatException('Invalid user ID.');
    }
    if (name is! String || name.trim().isEmpty) {
      throw const FormatException('Invalid user name.');
    }
    if (email is! String || email.trim().isEmpty) {
      throw const FormatException('Invalid user email.');
    }
    if (role != 'Tourist' && role != 'Vendor' && role != 'Admin') {
      throw const FormatException('Invalid user role.');
    }

    return AuthUser(
      id: id,
      name: name.trim(),
      email: email.trim(),
      role: role as String,
    );
  }
}

class LoginResponse {
  const LoginResponse({
    required this.accessToken,
    required this.tokenType,
    required this.expiresIn,
    required this.user,
  });

  final String accessToken;
  final String tokenType;
  final int expiresIn;
  final AuthUser user;

  factory LoginResponse.fromJson(Map<String, dynamic> json) {
    final token = json['access_token'];
    final tokenType = json['token_type'];
    final expiresIn = json['expires_in'];
    final userData = json['user'];

    if (token is! String || token.trim().isEmpty) {
      throw const FormatException('Invalid access token.');
    }
    if (tokenType != 'bearer') {
      throw const FormatException('Invalid token type.');
    }
    if (expiresIn is! int || expiresIn <= 0 || expiresIn > 1800) {
      throw const FormatException('Invalid token expiration.');
    }
    if (userData is! Map<String, dynamic>) {
      throw const FormatException('Invalid user data.');
    }

    return LoginResponse(
      accessToken: token.trim(),
      tokenType: tokenType as String,
      expiresIn: expiresIn,
      user: AuthUser.fromJson(userData),
    );
  }
}
