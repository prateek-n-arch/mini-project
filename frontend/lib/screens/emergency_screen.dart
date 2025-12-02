import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../services/api_service.dart';
import '../translations/translation_service.dart';

class EmergencyScreen extends StatefulWidget {
  const EmergencyScreen({super.key});

  @override
  State<EmergencyScreen> createState() => _EmergencyScreenState();
}

class _EmergencyScreenState extends State<EmergencyScreen> {
  List<Map<String, String>> _helplines = [];

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    try {
      final h = await ApiService.getHelplines();
      if (!mounted) return;
      setState(() => _helplines = h);
    } catch (e) {
      // optionally handle load error
      if (!mounted) return;
      final t = TranslationService.of(context);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(t.translate('failed_to_load'))),
      );
    }
  }

  Future<void> _call(String number) async {
    final t = TranslationService.of(context);

    if (number.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(t.translate('invalid_number'))),
      );
      return;
    }

    final uri = Uri(scheme: 'tel', path: number);

    try {
      // ask url_launcher if this can be handled
      final can = await canLaunchUrl(uri);
      if (!mounted) return;

      if (can) {
        // prefer external application when possible
        final launched = await launchUrl(uri, mode: LaunchMode.platformDefault);
        if (!mounted) return;
        if (!launched) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(t.translate('cannot_call'))),
          );
        }
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(t.translate('cannot_call'))),
        );
      }
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(t.translate('cannot_call'))),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final t = TranslationService.of(context);

    return Scaffold(
      appBar: AppBar(title: Text(t.translate('emergency_help'))),
      body: ListView.builder(
        itemCount: _helplines.length,
        itemBuilder: (c, i) {
          final h = _helplines[i];
          final label = h['label'] ?? '';
          final number = h['number'] ?? '';

          return ListTile(
            title: Text(label),
            subtitle: Text(number),
            trailing: ElevatedButton(
              onPressed: () => _call(number),
              child: Text(t.translate('call')),
            ),
          );
        },
      ),
    );
  }
}
