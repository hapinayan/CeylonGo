import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../data/home_mock_data.dart';
import '../../domain/models/category_item.dart';

/// Horizontally arranged category shortcut cards on the CeylonGo Home Screen.
///
/// Features:
/// - Soft pastel background per category
/// - Rounded card shape (`BorderRadius.circular(16)`)
/// - Integrated category icon and label
/// - Smooth horizontal scrolling with responsive width
/// - Informative placeholder feedback on tap
class CategoryShortcutsSection extends StatelessWidget {
  final ValueChanged<CategoryItem>? onCategoryTap;

  const CategoryShortcutsSection({
    super.key,
    this.onCategoryTap,
  });

  void _handleCategoryTap(BuildContext context, CategoryItem item) {
    if (onCategoryTap != null) {
      onCategoryTap!(item);
      return;
    }

    ScaffoldMessenger.of(context).hideCurrentSnackBar();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            Icon(item.icon, color: Colors.white, size: 20),
            const SizedBox(width: 10),
            Expanded(
              child: Text(
                'Browsing ${item.title} (Demo listing)',
                style: const TextStyle(fontWeight: FontWeight.w600),
              ),
            ),
          ],
        ),
        backgroundColor: AppColors.primary,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        duration: const Duration(seconds: 2),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final categories = HomeMockData.categories;

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 10.0),
      child: SizedBox(
        height: 82,
        child: ListView.separated(
          padding: const EdgeInsets.symmetric(horizontal: 20.0),
          scrollDirection: Axis.horizontal,
          physics: const BouncingScrollPhysics(),
          itemCount: categories.length,
          separatorBuilder: (context, index) => const SizedBox(width: 10),
          itemBuilder: (context, index) {
            final item = categories[index];
            return _CategoryCard(
              item: item,
              onTap: () => _handleCategoryTap(context, item),
            );
          },
        ),
      ),
    );
  }
}

class _CategoryCard extends StatelessWidget {
  final CategoryItem item;
  final VoidCallback onTap;

  const _CategoryCard({
    required this.item,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Ink(
          width: 72,
          height: 80,
          decoration: BoxDecoration(
            color: item.backgroundColor,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: item.iconColor.withValues(alpha: 0.12),
              width: 1,
            ),
          ),
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 10.0, horizontal: 4.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Icon(
                  item.icon,
                  color: item.iconColor,
                  size: 26,
                ),
                const SizedBox(height: 6),
                Text(
                  item.title,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    color: item.id == 'more'
                        ? AppColors.textSecondary
                        : AppColors.primary,
                    letterSpacing: -0.2,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
