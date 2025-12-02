import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mindecho_frontend/theme/app_theme.dart';
import 'screens/splash_screen.dart';
import 'state/settings_provider.dart';
import 'translations/translation_service.dart';

class MindEchoApp extends ConsumerWidget {
  const MindEchoApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final settings = ref.watch(settingsNotifierProvider);

    return MaterialApp(
      title: 'MindEcho',
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: settings.isDark ? ThemeMode.dark : ThemeMode.light,
      locale: settings.locale,
      supportedLocales: [
        const Locale('en', 'US'),
        const Locale('hi', 'IN'),
      ],
      localizationsDelegates: [
        TranslationService.delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      home: const SplashScreen(),
    );
  }
}
