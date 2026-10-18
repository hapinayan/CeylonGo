import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../../onboarding/presentation/onboarding_screen.dart';

/// Welcome screen for CeylonGo.
///
/// Layout:
/// - Top 60%: Full-width photography of Sri Lankan sunset (`assets/images/welcome/welcome-bg.png`)
/// - Bottom 40%: Clean white card (`#FFFFFF`) with rounded top transition
/// - Centered CeylonGo logo (`assets/images/branding/ceylongo-logo.png`) near top of white section
/// - Navy Blue headline with highlighted orange "Sri Lanka"
/// - Secondary localized description
/// - Large rounded Navy Blue (#082B5C) "Get Started" CTA navigating to [OnboardingScreen]
class WelcomeScreen extends StatelessWidget {
  const WelcomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final mediaQuery = MediaQuery.of(context);
    final screenHeight = mediaQuery.size.height;
    final isTablet = mediaQuery.size.width > 600;

    // Top 60% image, bottom ~42% content panel with smooth overlap
    final double imageHeight = screenHeight * 0.60;
    final double cardTop = screenHeight * 0.58;

    return Scaffold(
      backgroundColor: Colors.white,
      body: Stack(
        fit: StackFit.expand,
        children: [
          // 1. Top 60%: Sri Lankan Sunset Photography (No text over image)
          Positioned(
            top: 0,
            left: 0,
            right: 0,
            height: imageHeight,
            child: Image.asset(
              'assets/images/welcome/welcome-bg.png',
              fit: BoxFit.cover,
              alignment: Alignment.center,
            ),
          ),

          // 2. Bottom 40%: Clean White Section with subtle top transition
          Positioned(
            top: cardTop,
            bottom: 0,
            left: 0,
            right: 0,
            child: Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: const BorderRadius.vertical(
                  top: Radius.circular(32.0),
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.10),
                    blurRadius: 18.0,
                    offset: const Offset(0, -4),
                  ),
                ],
              ),
              child: SafeArea(
                top: false,
                child: Center(
                  child: ConstrainedBox(
                    constraints: BoxConstraints(
                      maxWidth: isTablet ? 540.0 : 400.0,
                    ),
                    child: SingleChildScrollView(
                      physics: const ClampingScrollPhysics(),
                      padding: EdgeInsets.symmetric(
                        horizontal: isTablet ? 36.0 : 24.0,
                        vertical: isTablet ? 20.0 : 16.0,
                      ),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          // 3. CeylonGo Logo near top of white section
                          Image.asset(
                            'assets/images/branding/ceylongo-logo.png',
                            width: isTablet ? 180.0 : 140.0,
                            fit: BoxFit.contain,
                          ),

                          SizedBox(height: isTablet ? 16.0 : 12.0),

                          // 4. Heading: "Your Way Around Sri Lanka"
                          RichText(
                            textAlign: TextAlign.center,
                            text: TextSpan(
                              style: TextStyle(
                                fontSize: isTablet ? 28.0 : 23.0,
                                fontWeight: FontWeight.w800,
                                letterSpacing: -0.4,
                                height: 1.25,
                                color: AppColors.primary,
                              ),
                              children: const [
                                TextSpan(text: 'Your Way Around '),
                                TextSpan(
                                  text: 'Sri Lanka',
                                  style: TextStyle(
                                    color: AppColors.accent,
                                  ),
                                ),
                              ],
                            ),
                          ),

                          SizedBox(height: isTablet ? 12.0 : 8.0),

                          // 5. Description
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 4.0),
                            child: Text(
                              'Discover breathtaking places, unique experiences, and authentic Sri Lankan culture all in one app.',
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                fontSize: isTablet ? 15.0 : 13.5,
                                fontWeight: FontWeight.w400,
                                color: AppColors.textSecondary,
                                height: 1.45,
                                letterSpacing: 0.1,
                              ),
                            ),
                          ),

                          SizedBox(height: isTablet ? 24.0 : 18.0),

                          // 6. Large Rounded Navy Blue Get Started Button
                          SizedBox(
                            width: double.infinity,
                            height: isTablet ? 58.0 : 52.0,
                            child: ElevatedButton(
                              onPressed: () {
                                Navigator.of(context).pushReplacement(
                                  PageRouteBuilder(
                                    pageBuilder: (context, animation,
                                            secondaryAnimation) =>
                                        const OnboardingScreen(),
                                    transitionsBuilder: (context, animation,
                                        secondaryAnimation, child) {
                                      return FadeTransition(
                                        opacity: CurvedAnimation(
                                          parent: animation,
                                          curve: Curves.easeInOut,
                                        ),
                                        child: child,
                                      );
                                    },
                                    transitionDuration:
                                        const Duration(milliseconds: 400),
                                  ),
                                );
                              },
                              style: ElevatedButton.styleFrom(
                                backgroundColor: AppColors.primary,
                                foregroundColor: AppColors.onPrimary,
                                elevation: 3,
                                shadowColor:
                                    AppColors.primary.withValues(alpha: 0.35),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(28.0),
                                ),
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 24.0,
                                ),
                              ),
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Text(
                                    'Get Started',
                                    style: TextStyle(
                                      fontSize: isTablet ? 17.0 : 15.5,
                                      fontWeight: FontWeight.w700,
                                      letterSpacing: 0.3,
                                      color: Colors.white,
                                    ),
                                  ),
                                  const SizedBox(width: 8.0),
                                  Icon(
                                    Icons.arrow_forward_rounded,
                                    size: isTablet ? 22.0 : 20.0,
                                    color: Colors.white,
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
