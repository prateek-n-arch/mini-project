import 'package:flutter/material.dart';
import '../translations/translation_service.dart';

class CameraCaptureScreen extends StatefulWidget {
  const CameraCaptureScreen({super.key});

  @override
  State<CameraCaptureScreen> createState() => _CameraCaptureScreenState();
}

class _CameraCaptureScreenState extends State<CameraCaptureScreen> {
  // This is a mock; in production use camera plugin to capture image bytes
  void _capture() {
    // return to chat with fake bytes
    Navigator.pop(context, <int>[1, 2, 3]);
  }

  @override
  Widget build(BuildContext context) {
    final t = TranslationService.of(context); // get translation instance

    return Scaffold(
      appBar: AppBar(title: Text(t.translate('capture_face'))),
      body: Center(
        child: ElevatedButton(
          onPressed: _capture,
          child: Text(t.translate('capture_face')),
        ),
      ),
    );
  }
}
