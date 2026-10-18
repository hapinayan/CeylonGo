// cspell:words wordmark

import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../domain/models/onboarding_item.dart';
import 'curved_clipper.dart';

/// Renders a single onboarding slide featuring the top travel photography
/// and the lower organic-curved white content panel.
class OnboardingPageItem extends StatelessWidget {
  final OnboardingItem item;

  const OnboardingPageItem({
    super.key,
    required this.item,
  });

  @override
  Widget build(BuildContext context) {
    final mediaQuery = MediaQuery.of(context);
    final screenHeight = mediaQuery.size.height;

    // Allocate upper ~59% to image, lower ~45% to curved content (with overlap)
    final imageHeight = screenHeight * 0.59;
    final contentHeight = screenHeight * 0.44;

    return Stack(
      fit: StackFit.expand,
      children: [
        // Upper 60% Photography with top gradient scrim for status/wordmark readability
        Positioned(
          top: 0,
          left: 0,
          right: 0,
          height: imageHeight,
          child: Stack(
            fit: StackFit.expand,
            children: [
              Image.asset(
                item.imagePath,
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) {
                  return Container(
                    color: AppColors.primary,
                    child: Center(
                      child: Icon(
                        item.categoryIcon,
                        size: 64,
                        color: Colors.white54,
                      ),
                    ),
                  );
                },
              ),
              // Top Dark Scrim for Brand & Counter visibility
              Positioned(
                top: 0,
                left: 0,
                right: 0,
                height: 120,
                child: DecoratedBox(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [
                        Colors.black.withValues(alpha: 0.65),
                        Colors.transparent,
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),

        // Lower White Content Panel with Organic Wave Top Edge
        Positioned(
          bottom: 0,
          left: 0,
          right: 0,
          height: contentHeight,
          child: ClipPath(
            clipper: const OrganicWaveClipper(),
            child: Container(
              color: Colors.white,
              padding: const EdgeInsets.fromLTRB(24, 38, 24, 80),
              child: SingleChildScrollView(
                physics: const NeverScrollableScrollPhysics(),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    // Circular Category Icon Pill
                    Container(
                      width: 52,
                      height: 52,
                      decoration: BoxDecoration(
                        color: AppColors.primaryContainer,
                        shape: BoxShape.circle,
                        border: Border.all(
                          color: AppColors.primary.withValues(alpha: 0.1),
                          width: 1.5,
                        ),
                      ),
                      child: Icon(
                        item.categoryIcon,
                        size: 26,
                        color: AppColors.primary,
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Headline with Highlighted Keywords
                    RichText(
                      textAlign: TextAlign.center,
                      text: TextSpan(
                        style: const TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.w800,
                          letterSpacing: -0.4,
                          height: 1.25,
                        ),
                        children: [
                          TextSpan(
                            text: item.titlePrefix,
                            style: const TextStyle(color: AppColors.primary),
                          ),
                          TextSpan(
                            text: item.highlightedTitle,
                            style: const TextStyle(color: AppColors.accent),
                          ),
                          if (item.titleSuffix.isNotEmpty)
                            TextSpan(
                              text: item.titleSuffix,
                              style: const TextStyle(color: AppColors.primary),
                            ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 12),

                    // Supporting Description
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 8.0),
                      child: Text(
                        item.description,
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                          fontSize: 14.5,
                          fontWeight: FontWeight.w400,
                          color: AppColors.textSecondary,
                          height: 1.45,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }
}
