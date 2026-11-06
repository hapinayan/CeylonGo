// =============================================================================
// CeylonGo — Module 07: Profile Page Shell Component
// Architecture: Angular 21 Standalone + Signals + Subcomponents
// =============================================================================

import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  PageContainerComponent,
  PageHeaderComponent,
  BreadcrumbsComponent,
  ButtonComponent,
  BreadcrumbItem,
} from '../../../../shared/components';
import { ProfileHeaderComponent } from '../../components/profile-header/profile-header.component';
import { PersonalInfoTabComponent } from '../../components/personal-info-tab/personal-info-tab.component';
import { PreferencesTabComponent } from '../../components/preferences-tab/preferences-tab.component';
import { SecurityTabComponent } from '../../components/security-tab/security-tab.component';
import { EmergencyContactTabComponent } from '../../components/emergency-contact-tab/emergency-contact-tab.component';
import { ProfileService } from '../../services/profile.service';
import { ProfileTab, ProfileTabId } from '../../models/profile.models';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    CommonModule,
    PageContainerComponent,
    PageHeaderComponent,
    BreadcrumbsComponent,
    ButtonComponent,
    ProfileHeaderComponent,
    PersonalInfoTabComponent,
    PreferencesTabComponent,
    SecurityTabComponent,
    EmergencyContactTabComponent,
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
})
export class ProfilePageComponent {
  protected readonly profileService = inject(ProfileService);

  // In-memory reactive state references from ProfileService
  protected readonly profile = this.profileService.profile;
  protected readonly userFullName = this.profileService.userFullName;
  protected readonly userInitials = this.profileService.userInitials;
  protected readonly userDistrictLabel = this.profileService.userDistrictLabel;

  // Active navigation tab signal
  protected readonly activeTab = signal<ProfileTabId>('personal');

  // Breadcrumbs trail for PageHeader
  protected readonly breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', url: '/' },
    { label: 'My Profile' },
  ];

  // Available Profile Section Tabs
  protected readonly tabs: ProfileTab[] = [
    {
      id: 'personal',
      label: 'Personal Information',
      icon: '👤',
      description: 'Full name, contact phone, district, and traveler bio',
    },
    {
      id: 'security',
      label: 'Security & Login',
      icon: '🔒',
      badge: 'Demo Mode',
      description: 'Simulated password change, 2FA toggle, and active sessions',
    },
    {
      id: 'preferences',
      label: 'Preferences',
      icon: '⚙️',
      description: 'Interface language, currency, and notifications',
    },
    {
      id: 'emergency',
      label: 'Emergency & Travel',
      icon: '🛟',
      description: 'Host assistance contacts, dietary and mobility notes',
    },
  ];

  /**
   * Switch the active profile tab
   */
  protected selectTab(tabId: ProfileTabId): void {
    this.activeTab.set(tabId);
  }

  /**
   * Accessible keyboard navigation across tab buttons (WCAG 2.1 AA)
   */
  protected handleTabKeydown(event: KeyboardEvent, currentIndex: number): void {
    let nextIndex = currentIndex;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        nextIndex = (currentIndex + 1) % this.tabs.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        nextIndex = (currentIndex - 1 + this.tabs.length) % this.tabs.length;
        break;
      case 'Home':
        event.preventDefault();
        nextIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        nextIndex = this.tabs.length - 1;
        break;
      default:
        return;
    }

    const nextTab = this.tabs[nextIndex];
    if (nextTab) {
      this.selectTab(nextTab.id);
      const tabElement = document.getElementById(`cg-profile-tab-${nextTab.id}`);
      tabElement?.focus();
    }
  }
}
