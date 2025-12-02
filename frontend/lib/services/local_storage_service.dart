import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:mindecho_frontend/models/mood_entry.dart';

class LocalStorageService {
  static const _moodKey = 'mood_entries';
  static Future<void> saveMood(MoodEntry e) async {
    final sp = await SharedPreferences.getInstance();
    final raw = sp.getStringList(_moodKey) ?? [];
    raw.add(json.encode(e.toJson()));
    await sp.setStringList(_moodKey, raw);
  }

  static Future<List<MoodEntry>> loadMood() async {
    final sp = await SharedPreferences.getInstance();
    final raw = sp.getStringList(_moodKey) ?? [];
    return raw.map((s) => MoodEntry.fromJson(json.decode(s))).toList();
  }

  static Future<void> clearMood() async {
    final sp = await SharedPreferences.getInstance();
    await sp.remove(_moodKey);
  }
}
