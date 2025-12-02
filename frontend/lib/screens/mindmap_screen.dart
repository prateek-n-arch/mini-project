import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../models/mood_entry.dart';

class MindMapScreen extends StatefulWidget {
  const MindMapScreen({super.key});

  @override
  State<MindMapScreen> createState() => _MindMapScreenState();
}

class _MindMapScreenState extends State<MindMapScreen> {
  List<MoodEntry> _entries = [];

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    try {
      final e = await ApiService.getMoodTimeline();
      if (!mounted) return;
      setState(() => _entries = e);
    } catch (err) {
      // optionally show an error
    }
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(12.0),
      child: Card(
        child: SizedBox(
          height: 300,
          child: Padding(
            padding: const EdgeInsets.all(12.0),
            child: _entries.isEmpty
                ? Center(child: Text('No mood data'))
                : Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      const Text(
                        'Mood timeline',
                        style: TextStyle(
                            fontSize: 16, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 8),
                      Expanded(
                        child: CustomPaint(
                          painter: _SparklinePainter(_entries),
                          child: Container(),
                        ),
                      ),
                      const SizedBox(height: 8),
                      _buildLegendRow(),
                    ],
                  ),
          ),
        ),
      ),
    );
  }

  Widget _buildLegendRow() {
    if (_entries.isEmpty) return const SizedBox.shrink();
    final scores = _entries.map((e) => e.score).toList();
    final min = scores.reduce((a, b) => a < b ? a : b);
    final max = scores.reduce((a, b) => a > b ? a : b);
    final latest = scores.last;
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text('min: $min'),
        Text('latest: $latest'),
        Text('max: $max'),
      ],
    );
  }
}

class _SparklinePainter extends CustomPainter {
  final List<MoodEntry> entries;
  _SparklinePainter(this.entries);

  @override
  void paint(Canvas canvas, Size size) {
    if (entries.isEmpty) return;

    final paintLine = Paint()
      ..color = Colors.blue
      ..strokeWidth = 2
      ..style = PaintingStyle.stroke
      ..isAntiAlias = true;

    final paintFill = Paint()
      // ignore: deprecated_member_use
      ..color = Colors.blue.withOpacity(0.2)
      ..style = PaintingStyle.fill;

    final int n = entries.length;
    final xs = List.generate(
        n, (i) => (n == 1) ? size.width / 2 : (i / (n - 1)) * size.width);

    final scores = entries.map((e) => e.score.toDouble()).toList();
    final minScore = scores.reduce((a, b) => a < b ? a : b);
    final maxScore = scores.reduce((a, b) => a > b ? a : b);
    final scoreRange = (maxScore - minScore) == 0 ? 1.0 : (maxScore - minScore);

    double mapY(double score) {
      final normalized = (score - minScore) / scoreRange;
      return size.height - (normalized * size.height);
    }

    final path = Path();
    for (int i = 0; i < n; i++) {
      final dx = xs[i];
      final dy = mapY(scores[i]);
      if (i == 0) {
        path.moveTo(dx, dy);
      } else {
        path.lineTo(dx, dy);
      }
    }

    final pathFill = Path.from(path);
    pathFill.lineTo(size.width, size.height);
    pathFill.lineTo(0, size.height);
    pathFill.close();

    canvas.drawPath(pathFill, paintFill);
    canvas.drawPath(path, paintLine);

    final paintDot = Paint()..color = Colors.blue;
    for (int i = 0; i < n; i++) {
      final dx = xs[i];
      final dy = mapY(scores[i]);
      canvas.drawCircle(Offset(dx, dy), 3.0, paintDot);
    }

    final gridPaint = Paint()
      // ignore: deprecated_member_use
      ..color = Colors.grey.withOpacity(0.25)
      ..strokeWidth = 1;
    canvas.drawLine(Offset(0, 0), Offset(size.width, 0), gridPaint);
    canvas.drawLine(Offset(0, size.height / 2),
        Offset(size.width, size.height / 2), gridPaint);
    canvas.drawLine(
        Offset(0, size.height), Offset(size.width, size.height), gridPaint);
  }

  @override
  bool shouldRepaint(covariant _SparklinePainter old) => old.entries != entries;
}
