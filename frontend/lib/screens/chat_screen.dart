import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../state/chat_provider.dart';
import '../widgets/chat_bubble.dart';
import '../translations/translation_service.dart';

class ChatScreen extends ConsumerStatefulWidget {
  const ChatScreen({super.key});
  @override
  ConsumerState<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends ConsumerState<ChatScreen> {
  final TextEditingController _controller = TextEditingController();

  void _sendText() async {
    final txt = _controller.text.trim();
    if (txt.isEmpty) return;
    _controller.clear();
    await ref.read(chatProvider.notifier).sendText(txt);
  }

  // For demo: send mock voice bytes
  void _sendVoice() async {
    final fake = Uint8List.fromList([1, 2, 3, 4]);
    await ref.read(chatProvider.notifier).sendVoice(fake);
  }

  @override
  Widget build(BuildContext context) {
    final messages = ref.watch(chatProvider);
    final t = TranslationService.of(context);

    return Column(
      children: [
        Expanded(
          child: ListView.builder(
            padding: const EdgeInsets.all(12),
            itemCount: messages.length,
            itemBuilder: (context, i) => ChatBubble(message: messages[i]),
          ),
        ),
        const Divider(height: 1),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
          child: Row(
            children: [
              IconButton(icon: const Icon(Icons.mic), onPressed: _sendVoice),
              Expanded(
                child: TextField(
                  controller: _controller,
                  decoration: InputDecoration(
                    hintText: t.translate('chat_hint'),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  minLines: 1,
                  maxLines: 4,
                ),
              ),
              const SizedBox(width: 8),
              FloatingActionButton(
                onPressed: _sendText,
                child: const Icon(Icons.send),
              ),
            ],
          ),
        ),
      ],
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }
}
