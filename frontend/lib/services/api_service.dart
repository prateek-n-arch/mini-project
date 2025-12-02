import 'package:uuid/uuid.dart';
import 'package:mindecho_frontend/models/message.dart';
import 'package:mindecho_frontend/models/mood_entry.dart';

class ApiService {
  // Mock implementations that simulate latency and responses.
  static const _uuid = Uuid();

  static Future<List<Message>> postTextChat(String text,
      {String? userId}) async {
    await Future.delayed(const Duration(milliseconds: 700));
    // Return user message + bot reply
    final userMsg = Message(
        id: _uuid.v4(), text: text, fromUser: true, time: DateTime.now());
    final botReply = Message(
      id: _uuid.v4(),
      text:
          "I hear you. Here's a tip: take three deep breaths. (mock response)",
      fromUser: false,
      time: DateTime.now(),
    );
    return [userMsg, botReply];
  }

  static Future<Map<String, dynamic>> postVoiceChat(
      List<int> audioBytes) async {
    await Future.delayed(const Duration(milliseconds: 900));
    // Mocked emotion detection
    return {
      'emotion': 'calm',
      'confidence': 0.78,
      'reply': 'Your voice sounds calm (mock).'
    };
  }

  static Future<Map<String, dynamic>> postFacialChat(
      List<int> imageBytes) async {
    await Future.delayed(const Duration(milliseconds: 900));
    return {
      'emotion': 'happy',
      'confidence': 0.82,
      'reply': 'You look happy (mock).'
    };
  }

  static Future<void> addMood(MoodEntry entry) async {
    await Future.delayed(const Duration(milliseconds: 300));
    // In production you'd POST to backend
  }

  static Future<List<MoodEntry>> getMoodTimeline() async {
    await Future.delayed(const Duration(milliseconds: 400));
    final now = DateTime.now();
    return List.generate(7, (i) {
      return MoodEntry(
        id: _uuid.v4(),
        emotion: [
          'happy',
          'sad',
          'neutral',
          'anxious',
          'calm',
          'stressed',
          'content'
        ][i % 7],
        score: 5 + (i % 5),
        timestamp: now.subtract(Duration(days: i)),
      );
    });
  }

  static Future<List<Map<String, String>>> getHelplines() async {
    await Future.delayed(const Duration(milliseconds: 200));
    return [
      {'label': 'National Helpline (India)', 'number': '9152987821'},
      {'label': 'Suicide Prevention', 'number': '08046110007'},
    ];
  }
}
