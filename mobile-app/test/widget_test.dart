// Basic smoke test for CeylonGo app startup.
//
// Verifies that the app launches and shows the login screen
// with the CeylonGo branding.

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:ceylongo_mobile/main.dart';

void main() {
  testWidgets('CeylonGo app renders login screen', (WidgetTester tester) async {
    await tester.pumpWidget(const CeylonGoApp());
    await tester.pumpAndSettle();

    // Verify CeylonGo branding is present
    expect(find.text('CeylonGo'), findsOneWidget);
    expect(find.text('Vendor & Admin Portal'), findsOneWidget);

    // Verify login form elements exist
    expect(find.byKey(const Key('email_field')), findsOneWidget);
    expect(find.byKey(const Key('password_field')), findsOneWidget);
    expect(find.byKey(const Key('login_button')), findsOneWidget);
  });
}
