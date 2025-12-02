import 'dart:async';
import 'package:flutter/material.dart';
import 'onboarding.dart';
import '../translations/translation_service.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});
  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _timer = Timer(const Duration(seconds: 2), () {
      if (!mounted) return;
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => const OnboardingScreen()),
      );
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final t = TranslationService.of(context);

    return Scaffold(
      backgroundColor: const Color(0xFF6C63FF),
      body: Center(
        child: Column(mainAxisSize: MainAxisSize.min, children: [
          const Icon(Icons.self_improvement, size: 72, color: Colors.white),
          const SizedBox(height: 16),
          Text(
            t.translate('splash_welcome'),
            style: const TextStyle(color: Colors.white, fontSize: 20),
          ),
        ]),
      ),
    );
  }
}
