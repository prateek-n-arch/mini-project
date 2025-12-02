// frontend/lib/config/env.dart
// ignore: constant_identifier_names
const String API_BASE = String.fromEnvironment(
  'API_BASE_URL',
  defaultValue: 'http://localhost:8000/api/v1',
);
