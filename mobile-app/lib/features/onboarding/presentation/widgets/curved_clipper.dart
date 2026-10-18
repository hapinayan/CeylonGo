import 'package:flutter/material.dart';

/// Custom clipper that renders an organic, wave-like top edge for the white content panel.
class OrganicWaveClipper extends CustomClipper<Path> {
  const OrganicWaveClipper();

  @override
  Path getClip(Size size) {
    final path = Path();
    path.moveTo(0, 26);

    // Smooth organic wave across the width
    path.cubicTo(
      size.width * 0.25,
      2,
      size.width * 0.50,
      32,
      size.width * 0.75,
      12,
    );
    path.quadraticBezierTo(
      size.width * 0.90,
      4,
      size.width,
      18,
    );

    path.lineTo(size.width, size.height);
    path.lineTo(0, size.height);
    path.close();
    return path;
  }

  @override
  bool shouldReclip(covariant CustomClipper<Path> oldClipper) => false;
}
