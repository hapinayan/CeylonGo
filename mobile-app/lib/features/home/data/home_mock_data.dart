// cspell:words homestay homestays lakeview Sigiriya sigiriya Mirissa mirissa Nuwara Eliya Negombo Badulla Arugam Anuradhapura Trincomalee

import 'package:flutter/material.dart';
import '../domain/models/category_item.dart';
import '../domain/models/destination_item.dart';
import '../domain/models/homestay_item.dart';

/// Predefined mock UI demo data for CeylonGo Home Screen.
///
/// NOTE: This data is localized for UI preview purposes and will be replaced
/// by backend REST API integrations in future phases.
class HomeMockData {
  HomeMockData._();

  /// Quick shortcut categories matching the approved preview design
  static const List<CategoryItem> categories = [
    CategoryItem(
      id: 'homestays',
      title: 'Homestays',
      icon: Icons.home_rounded,
      iconColor: Color(0xFF082B5C),
      backgroundColor: Color(0xFFEFF4FB),
    ),
    CategoryItem(
      id: 'experiences',
      title: 'Experiences',
      icon: Icons.landscape_rounded,
      iconColor: Color(0xFF15803D),
      backgroundColor: Color(0xFFE8F5E9),
    ),
    CategoryItem(
      id: 'food',
      title: 'Food & Dining',
      icon: Icons.restaurant_rounded,
      iconColor: Color(0xFFEA580C),
      backgroundColor: Color(0xFFFFF4E6),
    ),
    CategoryItem(
      id: 'transport',
      title: 'Transport',
      icon: Icons.directions_bus_rounded,
      iconColor: Color(0xFF3B82F6),
      backgroundColor: Color(0xFFEFF6FF),
    ),
    CategoryItem(
      id: 'more',
      title: 'More',
      icon: Icons.grid_view_rounded,
      iconColor: Color(0xFF475569),
      backgroundColor: Color(0xFFF1F5F9),
    ),
  ];

  /// Popular destinations in Sri Lanka matching the approved preview design
  static const List<DestinationItem> popularDestinations = [
    DestinationItem(
      id: 'trincomalee',
      name: 'Trincomalee',
      province: 'Eastern Province',
      imagePath: 'assets/images/home/dest_trincomalee.jpg',
      description: 'Pristine beaches, natural harbor and whale watching.',
    ),
    DestinationItem(
      id: 'sigiriya',
      name: 'Sigiriya',
      province: 'Central Province',
      imagePath: 'assets/images/home/dest_sigiriya.jpg',
      description: 'Ancient rock fortress and UNESCO World Heritage site.',
    ),
    DestinationItem(
      id: 'ella',
      name: 'Ella',
      province: 'Uva Province',
      imagePath: 'assets/images/home/dest_ella.jpg',
      description: 'Misty hills, Nine Arch Bridge, and tea plantations.',
    ),
    DestinationItem(
      id: 'galle',
      name: 'Galle',
      province: 'Southern Province',
      imagePath: 'assets/images/home/dest_galle.jpg',
      description: 'Historic colonial Dutch Fort and coastal lighthouse.',
    ),
    DestinationItem(
      id: 'mirissa',
      name: 'Mirissa',
      province: 'Southern Province',
      imagePath: 'assets/images/home/dest_mirissa.jpg',
      description: 'Golden palm beaches, surfing and ocean sunsets.',
    ),
  ];

  /// Featured demo homestay accommodations
  static const List<HomestayItem> featuredHomestays = [
    HomestayItem(
      id: 'lakeview_homestay',
      name: 'Lakeview Homestay',
      location: 'Kandy',
      price: 8500,
      currency: 'LKR',
      priceUnit: 'per night',
      rating: 4.8,
      reviewsCount: 38,
      imagePath: 'assets/images/home/homestay_lakeview.jpg',
      isFavorite: false,
    ),
    HomestayItem(
      id: 'coconut_villa',
      name: 'Coconut Villa',
      location: 'Mirissa',
      price: 12000,
      currency: 'LKR',
      priceUnit: 'per night',
      rating: 4.7,
      reviewsCount: 52,
      imagePath: 'assets/images/home/homestay_coconut_villa.jpg',
      isFavorite: false,
    ),
    HomestayItem(
      id: 'ella_cloud_mountain',
      name: 'Ella Cloud View',
      location: 'Ella',
      price: 9500,
      currency: 'LKR',
      priceUnit: 'per night',
      rating: 4.9,
      reviewsCount: 44,
      imagePath: 'assets/images/home/dest_ella.jpg',
      isFavorite: true,
    ),
    HomestayItem(
      id: 'galle_fort_haven',
      name: 'Galle Heritage Villa',
      location: 'Galle',
      price: 14500,
      currency: 'LKR',
      priceUnit: 'per night',
      rating: 4.8,
      reviewsCount: 29,
      imagePath: 'assets/images/home/dest_galle.jpg',
      isFavorite: false,
    ),
  ];

  /// Available demo Sri Lanka regions for the location selector
  static const List<String> availableRegions = [
    'Sri Lanka (All)',
    'Central Province (Kandy, Nuwara Eliya)',
    'Southern Province (Galle, Mirissa)',
    'Western Province (Colombo, Negombo)',
    'Uva Province (Ella, Badulla)',
    'Eastern Province (Trincomalee, Arugam Bay)',
    'North Central (Sigiriya, Anuradhapura)',
  ];
}
