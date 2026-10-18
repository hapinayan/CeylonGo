// cspell:words wordmark

import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';

/// Top bar displaying the CeylonGo wordmark at center and the slide counter at top right.
class OnboardingTopBar extends StatelessWidget {
  final String pageCounter;

  const OnboardingTopBar({
    super.key,
    required this.pageCounter,
  });

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      top: true,
      bottom: false,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 12.0),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            // Left spacer to keep center wordmark balanced
            const SizedBox(width: 48),

            // Top Center CeylonGo Wordmark
            RichText(
              textAlign: TextAlign.center,
              text: const TextSpan(
                style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.w800,
                  letterSpacing: -0.3,
                  shadows: [
                    Shadow(
                      color: Colors.black38,
                      offset: Offset(0, 1),
                      blurRadius: 4,
                    ),
                  ],
                ),
                children: [
                  TextSpan(
                    text: 'Ceylon',
                    style: TextStyle(color: Colors.white),
                  ),
                  TextSpan(
                    text: 'Go',
                    style: TextStyle(color: AppColors.accent),
                  ),
                ],
              ),
            ),

            // Top Right Page Counter Pill
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12.0, vertical: 6.0),
              decoration: BoxDecoration(
                color: Colors.black.withValues(alpha: 0.35),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(
                  color: Colors.white.withValues(alpha: 0.2),
                  width: 1,
                ),
              ),
              child: Text(
                pageCounter,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 13,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 0.5,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
