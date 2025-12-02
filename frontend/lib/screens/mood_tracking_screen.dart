import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/mood_entry.dart';
import '../services/local_storage_service.dart';
import 'package:uuid/uuid.dart';

class MoodTrackingScreen extends ConsumerStatefulWidget {
  const MoodTrackingScreen({super.key});

  @override
  ConsumerState<MoodTrackingScreen> createState() => _MoodTrackingScreenState();
}

class _MoodTrackingScreenState extends ConsumerState<MoodTrackingScreen> {
  List<MoodEntry> _entries = [];

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final e = await LocalStorageService.loadMood();
    setState(() => _entries = e);
  }

  Future<void> _addMood() async {
    final id = const Uuid().v4();
    final entry = MoodEntry(
      id: id,
      emotion: 'calm',
      score: 7,
      timestamp: DateTime.now(),
    );
    await LocalStorageService.saveMood(entry);
    await _load();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Expanded(
          child: ListView.builder(
            itemCount: _entries.length,
            itemBuilder: (c, i) {
              final e = _entries[i];
              return ListTile(
                leading: CircleAvatar(child: Text(e.score.toString())),
                title: Text(e.emotion),
                subtitle: Text(e.timestamp.toLocal().toString()),
              );
            },
          ),
        ),
        Padding(
          padding: const EdgeInsets.all(12.0),
          child: ElevatedButton.icon(
            onPressed: _addMood,
            icon: const Icon(Icons.add),
            label: Text(('add_mood')),
          ),
        ),
      ],
    );
  }
}
