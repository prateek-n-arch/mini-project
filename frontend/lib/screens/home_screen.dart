import 'package:flutter/material.dart';
import 'chat_screen.dart';
import 'mood_tracking_screen.dart';
import 'mindmap_screen.dart';
import 'settings_screen.dart';
import '../translations/translation_service.dart';
import 'emergency_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});
  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _idx = 0;

  // Keep this non-const to avoid errors if pages are not compile-time constants
  final pages = [
    ChatScreen(),
    MoodTrackingScreen(),
    MindMapScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    final t = TranslationService.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(t.translate('app_name')),
        actions: [
          IconButton(
            onPressed: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const SettingsScreen()),
            ),
            icon: const Icon(Icons.settings),
          ),
          IconButton(
            onPressed: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const EmergencyScreen()),
            ),
            icon: const Icon(Icons.local_phone),
          ),
        ],
      ),
      body: pages[_idx],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _idx,
        onTap: (i) => setState(() => _idx = i),
        items: [
          BottomNavigationBarItem(
            icon: const Icon(Icons.chat_bubble_outline),
            label: t.translate('home_chat'),
          ),
          BottomNavigationBarItem(
            icon: const Icon(Icons.mood),
            label: t.translate('home_mood'),
          ),
          BottomNavigationBarItem(
            icon: const Icon(Icons.map),
            label: t.translate('home_mindmap'),
          ),
        ],
      ),
    );
  }
}
