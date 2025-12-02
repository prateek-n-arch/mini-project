import 'package:flutter/material.dart';

class AppColors {
  static const primary = Color(0xFF6C63FF); // lavender variant
  static const accent = Color(0xFFFFC1E3);
  static const bg = Color(0xFFF7F6FB);
  static const card = Colors.white;
}

class AppTheme {
  static final lightTheme = ThemeData(
    primaryColor: AppColors.primary,
    scaffoldBackgroundColor: AppColors.bg,
    brightness: Brightness.light,

    appBarTheme: const AppBarTheme(
      backgroundColor: AppColors.primary,
      foregroundColor: Colors.white,
    ),

    // ✅ FIX: Use CardThemeData instead of CardTheme
    cardTheme: const CardThemeData(
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.all(Radius.circular(12)),
      ),
    ),

    floatingActionButtonTheme:
        const FloatingActionButtonThemeData(backgroundColor: AppColors.primary),
  );

  static final darkTheme = ThemeData(
    brightness: Brightness.dark,
    primaryColor: AppColors.primary,
    scaffoldBackgroundColor: Colors.black12,

    // Optional: matching dark card theme
    cardTheme: const CardThemeData(
      elevation: 2,
      color: Color(0xFF1E1E1E),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.all(Radius.circular(12)),
      ),
    ),
  );
}
