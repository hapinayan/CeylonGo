/// Model representing a popular travel destination card on the CeylonGo Home screen.
class DestinationItem {
  final String id;
  final String name;
  final String province;
  final String imagePath;
  final String? description;

  const DestinationItem({
    required this.id,
    required this.name,
    required this.province,
    required this.imagePath,
    this.description,
  });
}
