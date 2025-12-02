import 'package:flutter/material.dart';
import 'home_screen.dart';
import '../translations/translation_service.dart';

class OnboardingScreen extends StatelessWidget {
  const OnboardingScreen({super.key});

  void _continueAnon(BuildContext context) {
    // In production: create anonymous user ID & save in storage
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (_) => const HomeScreen()),
    );
  }

  @override
  Widget build(BuildContext context) {
    final t = TranslationService.of(context);

    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 40),
              Text(
                t.translate('onboarding_title'),
                style: const TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 24),
              const Text(
                'MindEcho helps you track mood and gives gentle coping tips.',
                style: TextStyle(fontSize: 16),
              ),
              const Spacer(),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () => _continueAnon(context),
                  child: Text(t.translate('login_anonymous')),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
