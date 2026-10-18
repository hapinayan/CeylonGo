import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';

/// Fixed bottom navigation bar for CeylonGo.
///
/// Five tabs matching the approved UI design:
/// 1. Home (`Icons.home_rounded`)
/// 2. Explore (`Icons.explore_outlined`)
/// 3. Bookings (`Icons.calendar_month_outlined`)
/// 4. Saved (`Icons.favorite_outline_rounded`)
/// 5. Profile (`Icons.person_outline_rounded`)
class HomeBottomNavigationBar extends StatelessWidget {
  final int currentIndex;
  final ValueChanged<int> onTabSelected;

  const HomeBottomNavigationBar({
    super.key,
    required this.currentIndex,
    required this.onTabSelected,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        border: const Border(
          top: BorderSide(
            color: Color(0xFFE2E8F0),
            width: 1,
          ),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 10,
            offset: const Offset(0, -3),
          ),
        ],
      ),
      child: SafeArea(
        top: false,
        child: SizedBox(
          height: 64,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _NavBarItem(
                index: 0,
                currentIndex: currentIndex,
                label: 'Home',
                icon: Icons.home_rounded,
                inactiveIcon: Icons.home_outlined,
                onTap: () => onTabSelected(0),
              ),
              _NavBarItem(
                index: 1,
                currentIndex: currentIndex,
                label: 'Explore',
                icon: Icons.explore_rounded,
                inactiveIcon: Icons.explore_outlined,
                onTap: () => onTabSelected(1),
              ),
              _NavBarItem(
                index: 2,
                currentIndex: currentIndex,
                label: 'Bookings',
                icon: Icons.calendar_month_rounded,
                inactiveIcon: Icons.calendar_month_outlined,
                onTap: () => onTabSelected(2),
              ),
              _NavBarItem(
                index: 3,
                currentIndex: currentIndex,
                label: 'Saved',
                icon: Icons.favorite_rounded,
                inactiveIcon: Icons.favorite_outline_rounded,
                onTap: () => onTabSelected(3),
              ),
              _NavBarItem(
                index: 4,
                currentIndex: currentIndex,
                label: 'Profile',
                icon: Icons.person_rounded,
                inactiveIcon: Icons.person_outline_rounded,
                onTap: () => onTabSelected(4),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _NavBarItem extends StatelessWidget {
  final int index;
  final int currentIndex;
  final String label;
  final IconData icon;
  final IconData inactiveIcon;
  final VoidCallback onTap;

  const _NavBarItem({
    required this.index,
    required this.currentIndex,
    required this.label,
    required this.icon,
    required this.inactiveIcon,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final bool isSelected = currentIndex == index;
    final Color itemColor = isSelected ? AppColors.primary : const Color(0xFF94A3B8);

    return Expanded(
      child: InkWell(
        onTap: onTap,
        splashColor: AppColors.primary.withValues(alpha: 0.08),
        highlightColor: Colors.transparent,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Active top indicator line
            AnimatedContainer(
              duration: const Duration(milliseconds: 250),
              curve: Curves.easeInOut,
              height: 3,
              width: isSelected ? 28 : 0,
              decoration: BoxDecoration(
                color: isSelected ? AppColors.primary : Colors.transparent,
                borderRadius: const BorderRadius.vertical(bottom: Radius.circular(2)),
              ),
            ),

            const SizedBox(height: 6),

            Icon(
              isSelected ? icon : inactiveIcon,
              color: itemColor,
              size: 22,
            ),

            const SizedBox(height: 3),

            Text(
              label,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: TextStyle(
                color: itemColor,
                fontSize: 11,
                fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                letterSpacing: 0.1,
              ),
            ),

            const SizedBox(height: 4),
          ],
        ),
      ),
    );
  }
}
