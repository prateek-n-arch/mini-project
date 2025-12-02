import 'package:flutter_test/flutter_test.dart';
import 'package:flutter/material.dart';
import 'package:mindecho_frontend/screens/splash_screen.dart';

void main() {
  testWidgets('Splash shows welcome', (WidgetTester tester) async {
    await tester.pumpWidget(const MaterialApp(home: SplashScreen()));
    expect(find.text('Welcome to MindEcho'), findsOneWidget);
  });
}
