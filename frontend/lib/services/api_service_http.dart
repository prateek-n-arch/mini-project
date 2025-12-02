// frontend/lib/services/api_service_http.dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/env.dart';
import 'package:mindecho_frontend/models/message.dart';
import 'package:mindecho_frontend/models/mood_entry.dart';
import 'package:uuid/uuid.dart';

const _uuid = Uuid();

class ApiServiceHttp {
  static Uri _uri(String path) => Uri.parse(
        '${const String.fromEnvironment('API_BASE_URL', defaultValue: API_BASE)}$path',
      );

  // Text chat -> /chat/text
  static Future<List<Message>> postTextChat(
    String text, {
    String? userId,
  }) async {
    final body = json.encode({"user_id": userId, "text": text});
    final resp = await http.post(
      _uri('/chat/text'),
      body: body,
      headers: {'Content-Type': 'application/json'},
    );
    if (resp.statusCode != 200) {
      throw Exception('Chat API failed: ${resp.statusCode}');
    }
    final j = json.decode(resp.body);
    // Build messages: user message + bot reply from response
    final userMsg = Message(
      id: _uuid.v4(),
      text: text,
      fromUser: true,
      time: DateTime.now(),
    );
    final botMsg = Message(
      id: _uuid.v4(),
      text: j['reply'] ?? '(no reply)',
      fromUser: false,
      time: DateTime.now(),
    );
    return [userMsg, botMsg];
  }

  // Voice: send audio bytes as multipart to /chat/voice if you implement it
  static Future<Map<String, dynamic>> postVoiceChat(
    List<int> audioBytes, {
    String? userId,
  }) async {
    final uri = _uri('/chat/voice');
    final request = http.MultipartRequest('POST', uri);
    request.fields['user_id'] = userId ?? '';
    request.files.add(
      http.MultipartFile.fromBytes('audio', audioBytes, filename: 'voice.wav'),
    );
    final streamed = await request.send();
    final resp = await http.Response.fromStream(streamed);
    if (resp.statusCode != 200) throw Exception('Voice API error');
    return json.decode(resp.body);
  }

  // Facial: send image bytes as multipart to /chat/facial
  static Future<Map<String, dynamic>> postFacialChat(
    List<int> imageBytes, {
    String? userId,
  }) async {
    final uri = _uri('/chat/facial');
    final request = http.MultipartRequest('POST', uri);
    request.fields['user_id'] = userId ?? '';
    request.files.add(
      http.MultipartFile.fromBytes('image', imageBytes, filename: 'face.jpg'),
    );
    final streamed = await request.send();
    final resp = await http.Response.fromStream(streamed);
    if (resp.statusCode != 200) throw Exception('Facial API error');
    return json.decode(resp.body);
  }

  static Future<void> addMood(MoodEntry entry) async {
    final resp = await http.post(
      _uri('/mood/add'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({
        "user_id": entry.id, // if you have a specific user
        "emotion": entry.emotion,
        "score": entry.score,
        "note": "",
      }),
    );
    if (resp.statusCode != 200) throw Exception('addMood failed');
  }

  static Future<List<MoodEntry>> getMoodTimeline() async {
    final resp = await http.get(_uri('/mood/timeline'));
    if (resp.statusCode != 200) throw Exception('timeline failed');
    final list = json.decode(resp.body) as List<dynamic>;
    return list
        .map((e) => MoodEntry.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  static Future<List<Map<String, String>>> getHelplines() async {
    final resp = await http.get(_uri('/emergency/helplines'));
    if (resp.statusCode != 200) throw Exception('helplines failed');
    final list = json.decode(resp.body) as List<dynamic>;
    return list.map((e) => Map<String, String>.from(e as Map)).toList();
  }
}
