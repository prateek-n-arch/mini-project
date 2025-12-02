import 'package:flutter/material.dart';

class VoiceRecorderButton extends StatefulWidget {
  final void Function(List<int>) onRecorded;
  const VoiceRecorderButton({super.key, required this.onRecorded});
  @override
  State<VoiceRecorderButton> createState() => _VoiceRecorderButtonState();
}

class _VoiceRecorderButtonState extends State<VoiceRecorderButton> {
  bool _recording = false;

  void _toggle() {
    setState(() => _recording = !_recording);
    if (!_recording) {
      // return fake bytes
      widget.onRecorded([1, 2, 3]);
    }
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onLongPress: _toggle,
      onLongPressUp: _toggle,
      child: CircleAvatar(
        radius: 28,
        backgroundColor: _recording ? Colors.redAccent : Colors.blue,
        child: Icon(
          _recording ? Icons.mic : Icons.mic_none,
          color: Colors.white,
        ),
      ),
    );
  }
}
