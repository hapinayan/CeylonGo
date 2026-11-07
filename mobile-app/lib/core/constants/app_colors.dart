import 'package:flutter/material.dart';

/// Centralized color palette for the CeylonGo application.
///
/// Follows the approved CeylonGo brand guidelines:
/// - Primary Navy: #082B5C (Primary brand identity, headers, main actions)
/// - Accent Orange: #FF9F1C (Ceylon warm accent, badges, highlights)
/// - Background: #F8FAFC (Clean Slate-50 background)
/// - Primary Text: #0F172A (Slate-900 high contrast readable text)
/// - Secondary Text: #475569 (Slate-600 descriptive and label text)
/// - Input Border: #E2E8F0 (Slate-200 subtle accessible border)
/// - Error: #EF4444 (Feedback & validation errors)
/// - Success: #10B981 (Success states & confirmations)
abstract final class AppColors {
  AppColors._();

  // Core Brand Colors
  static const Color primaryNavy = Color(0xFF082B5C);
  static const Color primaryNavyHover = Color(0xFF062045);
  static const Color primaryNavySubtle = Color(0xFFF0F4F9);

  static const Color accentOrange = Color(0xFFFF9F1C);
  static const Color accentOrangeHover = Color(0xFFE58E17);
  static const Color accentOrangeSubtle = Color(0xFFFFF7ED);

  // Backgrounds & Surfaces
  static const Color background = Color(0xFFF8FAFC);
  static const Color surface = Color(0xFFFFFFFF);

  // Typography & Text
  static const Color textPrimary = Color(0xFF0F172A);
  static const Color textSecondary = Color(0xFF475569);
  static const Color textMuted = Color(0xFF94A3B8);

  // Borders & Dividers
  static const Color inputBorder = Color(0xFFE2E8F0);
  static const Color borderFocused = primaryNavy;

  // Feedback & Status
  static const Color error = Color(0xFFEF4444);
  static const Color success = Color(0xFF10B981);
  static const Color warning = Color(0xFFF59E0B);
  static const Color info = Color(0xFF0284C7);
}
