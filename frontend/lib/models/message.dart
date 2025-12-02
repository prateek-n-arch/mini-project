class Message {
  final String id;
  final String text;
  final bool fromUser;
  final DateTime time;

  Message({
    required this.id,
    required this.text,
    required this.fromUser,
    required this.time,
  });
}
