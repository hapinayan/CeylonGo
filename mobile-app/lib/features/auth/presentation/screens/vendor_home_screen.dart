import 'package:flutter/material.dart';

import '../../../../core/constants/app_colors.dart';

/// CeylonGo Vendor Home — minimal placeholder screen.
///
/// Displays a welcome message and logout button. This is NOT a
/// complete dashboard; it is the navigation target for authenticated
/// Vendor users only.
class VendorHomeScreen extends StatelessWidget {
  const VendorHomeScreen({
    super.key,
    required this.userName,
    required this.onLogout,
  });

  final String userName;
  final VoidCallback onLogout;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('CeylonGo Vendor'),
        actions: [
          IconButton(
            key: const Key('logout_button'),
            icon: const Icon(Icons.logout),
            tooltip: 'Logout',
            onPressed: onLogout,
          ),
        ],
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                width: 80,
                height: 80,
                decoration: BoxDecoration(
                  color: AppColors.accentOrangeSubtle,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: const Icon(
                  Icons.storefront,
                  size: 40,
                  color: AppColors.accentOrange,
                ),
              ),
              const SizedBox(height: 24),
              Text(
                'Welcome, $userName!',
                style: Theme.of(context).textTheme.headlineMedium,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 8),
              Text(
                'Vendor Dashboard',
                style: Theme.of(context).textTheme.bodyMedium,
              ),
              const SizedBox(height: 32),
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(20.0),
                  child: Column(
                    children: [
                      Icon(
                        Icons.construction,
                        size: 48,
                        color: AppColors.textMuted,
                      ),
                      const SizedBox(height: 12),
                      Text(
                        'Dashboard coming soon',
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Your vendor tools will appear here.',
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
