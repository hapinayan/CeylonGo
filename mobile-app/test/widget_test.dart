import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:ceylongo_mobile/main.dart';
import 'package:ceylongo_mobile/features/home/presentation/home_screen.dart';
import 'package:ceylongo_mobile/features/splash/presentation/splash_screen.dart';

void main() {
  testWidgets('Splash screen renders brand title', (WidgetTester tester) async {
    await tester.pumpWidget(const MyApp());

    expect(find.byType(SplashScreen), findsOneWidget);
    expect(find.text('CeylonGo', findRichText: true), findsOneWidget);
  });

  testWidgets('HomeScreen renders all required components and sections',
      (WidgetTester tester) async {
    // Set a phone screen resolution (e.g. Samsung Galaxy A54 1080x2340 logical equivalent ~ 412x915)
    tester.view.physicalSize = const Size(1080, 2340);
    tester.view.devicePixelRatio = 2.625;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);

    await tester.pumpWidget(
      const MaterialApp(
        home: HomeScreen(),
      ),
    );

    await tester.pumpAndSettle();

    // Verify Header
    expect(find.text('Sri Lanka'), findsOneWidget);
    expect(find.byIcon(Icons.location_on_rounded), findsWidgets);
    expect(find.byIcon(Icons.notifications_none_rounded), findsOneWidget);

    // Verify Search Bar
    expect(
      find.text('Search destinations, homestays, experiences...'),
      findsOneWidget,
    );
    expect(find.byIcon(Icons.tune_rounded), findsOneWidget);

    // Verify Hero Banner
    expect(find.textContaining('Discover', findRichText: true), findsOneWidget);
    expect(find.text('Explore Now'), findsOneWidget);

    // Verify Categories
    expect(find.text('Homestays'), findsWidgets);
    expect(find.text('Experiences'), findsOneWidget);
    expect(find.text('Food & Dining'), findsOneWidget);
    expect(find.text('Transport'), findsOneWidget);
    expect(find.text('More'), findsOneWidget);

    // Verify Section Headings
    expect(find.text('Popular Destinations'), findsOneWidget);
    expect(find.text('Featured Homestays'), findsOneWidget);

    // Verify Bottom Navigation Bar Tabs
    expect(find.text('Home'), findsOneWidget);
    expect(find.text('Explore'), findsOneWidget);
    expect(find.text('Bookings'), findsOneWidget);
    expect(find.text('Saved'), findsOneWidget);
    expect(find.text('Profile'), findsOneWidget);
  });

  testWidgets('Bottom navigation tab switching shows placeholder and returns to home',
      (WidgetTester tester) async {
    tester.view.physicalSize = const Size(1080, 2340);
    tester.view.devicePixelRatio = 2.625;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);

    await tester.pumpWidget(
      const MaterialApp(
        home: HomeScreen(),
      ),
    );

    await tester.pumpAndSettle();

    // Tap Explore tab
    await tester.tap(find.text('Explore'));
    await tester.pumpAndSettle();

    expect(find.text('Explore Sri Lanka'), findsOneWidget);
    expect(find.text('Back to Home'), findsOneWidget);

    // Tap 'Back to Home'
    await tester.tap(find.text('Back to Home'));
    await tester.pumpAndSettle();

    expect(find.text('Discover\nSri Lanka'), findsOneWidget);
  });

  testWidgets('MyHomePage delegates to HomeScreen', (WidgetTester tester) async {
    await tester.pumpWidget(
      const MaterialApp(
        home: MyHomePage(title: 'CeylonGo'),
      ),
    );

    await tester.pumpAndSettle();
    expect(find.byType(HomeScreen), findsOneWidget);
  });
}
