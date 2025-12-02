import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../state/settings_provider.dart';
import '../translations/translation_service.dart';

class SettingsScreen extends ConsumerWidget {
  const SettingsScreen({super.key});
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final settings = ref.watch(settingsNotifierProvider);
    final t = TranslationService.of(context);

    return Scaffold(
      appBar: AppBar(title: Text(t.translate('settings'))),
      body: Padding(
        padding: const EdgeInsets.all(12.0),
        child: Column(
          children: [
            ListTile(
              title: Text(t.translate('theme')),
              trailing: Switch(
                value: settings.isDark,
                onChanged: (_) =>
                    ref.read(settingsNotifierProvider.notifier).toggleTheme(),
              ),
            ),
            ListTile(
              title: Text(t.translate('language')),
              trailing: DropdownButton<Locale>(
                value: settings.locale,
                items: const [
                  DropdownMenuItem(
                    value: Locale('en', 'US'),
                    child: Text('English'),
                  ),
                  DropdownMenuItem(
                    value: Locale('hi', 'IN'),
                    child: Text('हिन्दी'),
                  ),
                ],
                onChanged: (v) => ref
                    .read(settingsNotifierProvider.notifier)
                    .setLocale(v ?? const Locale('en', 'US')),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
