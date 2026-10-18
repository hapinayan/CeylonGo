import 'package:flutter/material.dart';

/// Model representing a quick navigation category on the CeylonGo Home screen.
class CategoryItem {
  final String id;
  final String title;
  final IconData icon;
  final Color iconColor;
  final Color backgroundColor;

  const CategoryItem({
    required this.id,
    required this.title,
    required this.icon,
    required this.iconColor,
    required this.backgroundColor,
  });
}
