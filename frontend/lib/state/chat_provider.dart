import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mindecho_frontend/models/message.dart';
import 'package:mindecho_frontend/services/api_service.dart';
import 'package:uuid/uuid.dart';

final chatProvider = StateNotifierProvider<ChatNotifier, List<Message>>((ref) => ChatNotifier());

class ChatNotifier extends StateNotifier<List<Message>> {
  ChatNotifier() : super([]);

  Future<void> sendText(String text) async {
    final result = await ApiService.postTextChat(text);
    state = [...state, ...result];
  }

  Future<void> sendVoice(List<int> bytes) async {
    final resp = await ApiService.postVoiceChat(bytes);
    final id = const Uuid().v4();
    state = [
      ...state,
      Message(id: id, text: resp['reply'] ?? '...', fromUser: false, time: DateTime.now())
    ];
  }

  Future<void> sendFace(List<int> bytes) async {
    final resp = await ApiService.postFacialChat(bytes);
    final id = const Uuid().v4();
    state = [
      ...state,
      Message(id: id, text: resp['reply'] ?? '...', fromUser: false, time: DateTime.now())
    ];
  }
}
