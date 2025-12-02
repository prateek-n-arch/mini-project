import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

class SettingsState {
  final bool isDark;
  final Locale locale;

  SettingsState({required this.isDark, required this.locale});

  SettingsState copyWith({bool? isDark, Locale? locale}) {
    return SettingsState(isDark: isDark ?? this.isDark, locale: locale ?? this.locale);
  }
}

class SettingsNotifier extends StateNotifier<SettingsState> {
  SettingsNotifier() : super(SettingsState(isDark: false, locale: const Locale('en', 'US'))) {
    _load();
  }

  Future<void> _load() async {
    final sp = await SharedPreferences.getInstance();
    final isDark = sp.getBool('isDark') ?? false;
    final lang = sp.getString('lang') ?? 'en';
    state = state.copyWith(isDark: isDark, locale: Locale(lang));
  }

  Future<void> toggleTheme() async {
    final sp = await SharedPreferences.getInstance();
    final nxt = !state.isDark;
    state = state.copyWith(isDark: nxt);
    await sp.setBool('isDark', nxt);
  }

  Future<void> setLocale(Locale locale) async {
    final sp = await SharedPreferences.getInstance();
    state = state.copyWith(locale: locale);
    await sp.setString('lang', locale.languageCode);
  }
}

final settingsNotifierProvider = StateNotifierProvider<SettingsNotifier, SettingsState>(
  (ref) => SettingsNotifier(),
);
