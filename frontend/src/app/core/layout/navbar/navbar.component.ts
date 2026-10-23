import { Component, signal, computed, inject, HostListener, ElementRef } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  private readonly elementRef = inject(ElementRef);
  private readonly authService = inject(AuthService);

  // Authentication State from AuthService (defaults to guest unauthenticated)
  protected readonly isLoggedIn = this.authService.isAuthenticated;
  protected readonly currentUser = this.authService.currentUser;

  // Dynamic user display properties (no hardcoded credentials)
  protected readonly userName = computed(() => this.currentUser()?.name || 'Traveler');
  protected readonly userRole = computed(() => this.currentUser()?.role || 'CeylonGo Traveler');
  protected readonly userAvatar = computed(() => this.currentUser()?.avatarUrl || null);
  protected readonly userInitial = computed(() => {
    const name = this.currentUser()?.name?.trim();
    return name && name.length > 0 ? name.charAt(0).toUpperCase() : 'U';
  });

  // UI Dropdown States
  protected readonly isMobileMenuOpen = signal(false);
  protected readonly isLocationDropdownOpen = signal(false);
  protected readonly isProfileDropdownOpen = signal(false);
  protected readonly selectedLocation = signal('Sri Lanka');

  protected readonly locations = [
    'Sri Lanka (All)',
    'Ella & Badulla',
    'Kandy & Central',
    'Galle & South Coast',
    'Sigiriya & Cultural Triangle',
    'Mirissa & Weligama',
    'Jaffna & North',
    'Nuwara Eliya',
    'Trincomalee & East',
  ];

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isLocationDropdownOpen.set(false);
      this.isProfileDropdownOpen.set(false);
    }
  }

  protected toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((v) => !v);
  }

  protected closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  protected toggleLocationDropdown(): void {
    this.isProfileDropdownOpen.set(false);
    this.isLocationDropdownOpen.update((v) => !v);
  }

  protected selectLocation(loc: string): void {
    this.selectedLocation.set(loc.replace(' (All)', ''));
    this.isLocationDropdownOpen.set(false);
  }

  protected toggleProfileDropdown(): void {
    this.isLocationDropdownOpen.set(false);
    this.isProfileDropdownOpen.update((v) => !v);
  }

  protected logout(): void {
    this.authService.logout();
    this.isProfileDropdownOpen.set(false);
  }
}
