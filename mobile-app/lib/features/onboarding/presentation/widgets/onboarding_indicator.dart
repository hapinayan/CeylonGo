import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';

/// Animated pagination indicator dots for onboarding.
class OnboardingIndicator extends StatelessWidget {
  final int count;
  final int currentIndex;

  const OnboardingIndicator({
    super.key,
    required this.count,
    required this.currentIndex,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: List.generate(count, (index) {
        final isActive = index == currentIndex;
        return AnimatedContainer(
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOutCubic,
          margin: const EdgeInsets.symmetric(horizontal: 4.0),
          height: 8.0,
          width: isActive ? 24.0 : 8.0,
          decoration: BoxDecoration(
            color: isActive ? AppColors.accent : const Color(0xFFCBD5E1),
            borderRadius: BorderRadius.circular(4.0),
          ),
        );
      }),
    );
  }
}
