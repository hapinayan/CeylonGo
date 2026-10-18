/// Model representing a featured homestay listing on the CeylonGo Home screen.
class HomestayItem {
  final String id;
  final String name;
  final String location;
  final double price;
  final String currency;
  final String priceUnit;
  final double rating;
  final int reviewsCount;
  final String imagePath;
  final bool isFavorite;

  const HomestayItem({
    required this.id,
    required this.name,
    required this.location,
    required this.price,
    this.currency = 'LKR',
    this.priceUnit = 'per night',
    required this.rating,
    this.reviewsCount = 24,
    required this.imagePath,
    this.isFavorite = false,
  });

  /// Formatted price string e.g. "LKR 8,500"
  String get formattedPrice {
    final int intPrice = price.round();
    final String priceStr = intPrice.toString().replaceAllMapped(
          RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'),
          (Match m) => '${m[1]},',
        );
    return '$currency $priceStr';
  }

  HomestayItem copyWith({
    String? id,
    String? name,
    String? location,
    double? price,
    String? currency,
    String? priceUnit,
    double? rating,
    int? reviewsCount,
    String? imagePath,
    bool? isFavorite,
  }) {
    return HomestayItem(
      id: id ?? this.id,
      name: name ?? this.name,
      location: location ?? this.location,
      price: price ?? this.price,
      currency: currency ?? this.currency,
      priceUnit: priceUnit ?? this.priceUnit,
      rating: rating ?? this.rating,
      reviewsCount: reviewsCount ?? this.reviewsCount,
      imagePath: imagePath ?? this.imagePath,
      isFavorite: isFavorite ?? this.isFavorite,
    );
  }
}
