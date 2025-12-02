class MoodEntry {
  final String id;
  final String emotion;
  final int score; // 1-10
  final DateTime timestamp;

  MoodEntry({
    required this.id,
    required this.emotion,
    required this.score,
    required this.timestamp,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'emotion': emotion,
        'score': score,
        'timestamp': timestamp.toIso8601String(),
      };

  static MoodEntry fromJson(Map<String, dynamic> j) => MoodEntry(
        id: j['id'],
        emotion: j['emotion'],
        score: j['score'],
        timestamp: DateTime.parse(j['timestamp']),
      );
}
