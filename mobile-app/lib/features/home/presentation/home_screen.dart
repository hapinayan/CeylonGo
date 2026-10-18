import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../data/home_mock_data.dart';
import '../domain/models/homestay_item.dart';
import 'widgets/category_shortcuts_section.dart';
import 'widgets/featured_homestays_section.dart';
import 'widgets/hero_banner_card.dart';
import 'widgets/home_bottom_navigation_bar.dart';
import 'widgets/home_header.dart';
import 'widgets/home_search_bar.dart';
import 'widgets/popular_destinations_section.dart';
import 'widgets/tab_placeholder_view.dart';

/// The official CeylonGo Home Screen.
///
/// Integrates:
/// - Brand Header with CeylonGo Logo, Location Selector & Notifications
/// - Rounded Search Bar with Filter Modal
/// - Discover Sri Lanka Hero Banner with Sigiriya photography
/// - 5 Category Shortcuts (Homestays, Experiences, Dining, Transport, More)
/// - Popular Destinations horizontal card carousel
/// - Featured Homestays horizontal card carousel with live favorite toggling
/// - 5-tab fixed Bottom Navigation Bar (Home, Explore, Bookings, Saved, Profile)
class HomeScreen extends StatefulWidget {
  final String title;

  const HomeScreen({
    super.key,
    this.title = 'CeylonGo',
  });

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _selectedTabIndex = 0;
  String _currentLocation = 'Sri Lanka';
  late List<HomestayItem> _homestays;
  final TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _homestays = List<HomestayItem>.from(HomeMockData.featuredHomestays);
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _onLocationChanged(String newLocation) {
    setState(() {
      _currentLocation = newLocation;
    });

    ScaffoldMessenger.of(context).hideCurrentSnackBar();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Showing experiences for $_currentLocation'),
        backgroundColor: AppColors.primary,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        duration: const Duration(seconds: 2),
      ),
    );
  }

  void _onNotificationTap() {
    ScaffoldMessenger.of(context).hideCurrentSnackBar();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Row(
          children: [
            Icon(Icons.notifications_active_rounded, color: Colors.white, size: 20),
            SizedBox(width: 10),
            Expanded(
              child: Text(
                'Welcome to CeylonGo! Explore Sigiriya and Ella today.',
                style: TextStyle(fontWeight: FontWeight.w600),
              ),
            ),
          ],
        ),
        backgroundColor: AppColors.primary,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        duration: const Duration(seconds: 3),
      ),
    );
  }

  void _onFavoriteToggle(HomestayItem homestay) {
    setState(() {
      final index = _homestays.indexWhere((item) => item.id == homestay.id);
      if (index != -1) {
        final current = _homestays[index];
        _homestays[index] = current.copyWith(isFavorite: !current.isFavorite);
      }
    });

    ScaffoldMessenger.of(context).hideCurrentSnackBar();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          homestay.isFavorite
              ? 'Removed ${homestay.name} from Saved'
              : 'Saved ${homestay.name} to Favorites!',
        ),
        backgroundColor: AppColors.primary,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        duration: const Duration(seconds: 1),
      ),
    );
  }

  void _onExploreNowTap() {
    ScaffoldMessenger.of(context).hideCurrentSnackBar();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Text('Discovering Sigiriya: The 8th Wonder of the World!'),
        backgroundColor: AppColors.accentDark,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        duration: const Duration(seconds: 2),
      ),
    );
  }

  Widget _buildHomeTabBody() {
    return SafeArea(
      child: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 1. Home Header (Logo, Location selector pill, Notification bell)
            HomeHeader(
              currentLocation: _currentLocation,
              onLocationChanged: _onLocationChanged,
              onNotificationTap: _onNotificationTap,
            ),

            const SizedBox(height: 4),

            // 2. Search Bar with Filter
            HomeSearchBar(
              controller: _searchController,
            ),

            const SizedBox(height: 8),

            // 3. Hero Banner Card (Sigiriya Discover Sri Lanka)
            HeroBannerCard(
              onExploreTap: _onExploreNowTap,
            ),

            const SizedBox(height: 6),

            // 4. Quick Category Shortcuts (Homestays, Experiences, Dining, Transport, More)
            const CategoryShortcutsSection(),

            const SizedBox(height: 8),

            // 5. Popular Destinations (Horizontal scroll)
            const PopularDestinationsSection(),

            const SizedBox(height: 18),

            // 6. Featured Homestays (Horizontal scroll)
            FeaturedHomestaysSection(
              homestays: _homestays,
              onFavoriteToggle: _onFavoriteToggle,
            ),

            const SizedBox(height: 28),
          ],
        ),
      ),
    );
  }

  Widget _buildCurrentTabBody() {
    switch (_selectedTabIndex) {
      case 0:
        return _buildHomeTabBody();
      case 1:
        return TabPlaceholderView(
          title: 'Explore Sri Lanka',
          icon: Icons.explore_rounded,
          subtitle:
              'Discover interactive maps, hidden gems, and travel itineraries across the pearl of the Indian Ocean.',
          onBackToHome: () => setState(() => _selectedTabIndex = 0),
        );
      case 2:
        return TabPlaceholderView(
          title: 'Your Bookings',
          icon: Icons.calendar_month_rounded,
          subtitle:
              'Manage your homestay reservations, verified local tour guides, and scheduled rides seamlessly.',
          onBackToHome: () => setState(() => _selectedTabIndex = 0),
        );
      case 3:
        return TabPlaceholderView(
          title: 'Saved Places',
          icon: Icons.favorite_rounded,
          subtitle:
              'All your bookmarked homestays, must-see destinations, and local food spots in one place.',
          onBackToHome: () => setState(() => _selectedTabIndex = 0),
        );
      case 4:
        return TabPlaceholderView(
          title: 'Profile & Account',
          icon: Icons.person_rounded,
          subtitle:
              'Customize your travel preferences, currencies, account settings, and contact verified hosts.',
          onBackToHome: () => setState(() => _selectedTabIndex = 0),
        );
      default:
        return _buildHomeTabBody();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: _buildCurrentTabBody(),
      bottomNavigationBar: HomeBottomNavigationBar(
        currentIndex: _selectedTabIndex,
        onTabSelected: (index) {
          setState(() {
            _selectedTabIndex = index;
          });
        },
      ),
    );
  }
}
