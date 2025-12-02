import 'package:flutter/material.dart';

class TranslationService {
  final Map<String, Map<String, String>> _localizedValues = {
    'en': {
      'hello': 'Hello',
      'welcome': 'Welcome',
    },
    'hi': {
      'hello': 'नमस्ते',
      'welcome': 'स्वागत है',
    },
  };

  final String locale;

  TranslationService(this.locale);

  String translate(String key) {
    return _localizedValues[locale]?[key] ?? key;
  }

  // Factory method to get instance
  static TranslationService of(BuildContext context) {
    return Localizations.of<TranslationService>(context, TranslationService)!;
  }

  // Add the delegate for Flutter
  static const LocalizationsDelegate<TranslationService> delegate =
      _TranslationServiceDelegate();
}

// Custom delegate class
class _TranslationServiceDelegate
    extends LocalizationsDelegate<TranslationService> {
  const _TranslationServiceDelegate();

  @override
  bool isSupported(Locale locale) => ['en', 'hi'].contains(locale.languageCode);

  @override
  Future<TranslationService> load(Locale locale) async {
    return TranslationService(locale.languageCode);
  }

  @override
  bool shouldReload(covariant LocalizationsDelegate<TranslationService> old) =>
      false;
}
