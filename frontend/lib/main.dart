import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'app.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();

  // ProviderScope is not const, child is const (MindEchoApp has const constructor)
  runApp(
    ProviderScope(
      child: const MindEchoApp(),
    ),
  );
}
