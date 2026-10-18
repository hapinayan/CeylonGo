// cspell:words Sinhala Tamil

import 'package:flutter/material.dart';

/// Data model representing a single onboarding slide.
class OnboardingItem {
  final String imagePath;
  final String titlePrefix;
  final String highlightedTitle;
  final String titleSuffix;
  final String description;
  final IconData categoryIcon;
  final String pageCounter;
  final String buttonText;
  final bool isLast;

  const OnboardingItem({
    required this.imagePath,
    required this.titlePrefix,
    required this.highlightedTitle,
    this.titleSuffix = '',
    required this.description,
    required this.categoryIcon,
    required this.pageCounter,
    required this.buttonText,
    this.isLast = false,
  });

  /// The predefined onboarding items for CeylonGo
  static const List<OnboardingItem> items = [
    OnboardingItem(
      imagePath: 'assets/images/onboarding/homestay.png',
      titlePrefix: 'Find Authentic ',
      highlightedTitle: 'Homestays',
      titleSuffix: '',
      description:
          'Stay with local families and experience real Sri Lankan hospitality.',
      categoryIcon: Icons.home_rounded,
      pageCounter: '1/3',
      buttonText: 'Next',
      isLast: false,
    ),
    OnboardingItem(
      imagePath: 'assets/images/onboarding/activities.png',
      titlePrefix: 'Explore Local ',
      highlightedTitle: 'Experiences',
      titleSuffix: '',
      description:
          'Discover adventure, nature and unique activities across Sri Lanka.',
      categoryIcon: Icons.explore_rounded,
      pageCounter: '2/3',
      buttonText: 'Next',
      isLast: false,
    ),
    OnboardingItem(
      imagePath: 'assets/images/onboarding/culture.png',
      titlePrefix: 'Experience Our ',
      highlightedTitle: 'Rich Culture',
      titleSuffix: '',
      description:
          'Discover the unique blend of Tamil, Sinhala and Sri Lankan heritage.',
      categoryIcon: Icons.temple_buddhist_rounded,
      pageCounter: '3/3',
      buttonText: 'Start Exploring',
      isLast: true,
    ),
  ];
}
