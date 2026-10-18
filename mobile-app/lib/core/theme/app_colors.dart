import 'package:flutter/material.dart';

/// Defines the brand and semantic colors for the CeylonGo application.
///
/// Brand Identity:
/// - Primary: Navy Blue `#082B5C`
/// - Accent: Vibrant Orange `#FF9F1C`
/// - Background: Pure White `#FFFFFF`
class AppColors {
  AppColors._();

  // Primary Palette (Navy Blue)
  static const Color primary = Color(0xFF082B5C);
  static const Color primaryLight = Color(0xFF134280);
  static const Color primaryDark = Color(0xFF041938);
  static const Color primaryContainer = Color(0xFFE8EEF6);
  static const Color onPrimary = Color(0xFFFFFFFF);
  static const Color onPrimaryContainer = Color(0xFF082B5C);

  // Accent Palette (Orange)
  static const Color accent = Color(0xFFFF9F1C);
  static const Color accentLight = Color(0xFFFFB64D);
  static const Color accentDark = Color(0xFFE08200);
  static const Color accentContainer = Color(0xFFFFF3E0);
  static const Color onAccent = Color(0xFFFFFFFF);
  static const Color onAccentContainer = Color(0xFF5A3500);

  // Surface & Background
  static const Color background = Color(0xFFFFFFFF);
  static const Color scaffoldBackground = Color(0xFFF8FAFC);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color surfaceVariant = Color(0xFFF1F5F9);
  static const Color onSurface = Color(0xFF0F172A);
  static const Color onSurfaceVariant = Color(0xFF475569);

  // Neutral / Typography Colors
  static const Color textPrimary = Color(0xFF0F172A);
  static const Color textSecondary = Color(0xFF475569);
  static const Color textMuted = Color(0xFF94A3B8);
  static const Color textWhite = Color(0xFFFFFFFF);

  // Borders, Dividers & Outlines
  static const Color border = Color(0xFFE2E8F0);
  static const Color borderFocused = Color(0xFF082B5C);
  static const Color divider = Color(0xFFE2E8F0);

  // Semantic Status Colors
  static const Color success = Color(0xFF10B981);
  static const Color warning = Color(0xFFF59E0B);
  static const Color error = Color(0xFFEF4444);
  static const Color info = Color(0xFF3B82F6);
}
