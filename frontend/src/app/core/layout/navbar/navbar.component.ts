import { Component, HostListener, ElementRef, computed, inject, signal } from '@angular/core';
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

  protected readonly isMobileMenuOpen = signal(false);
  protected readonly isLocationDropdownOpen = signal(false);
  protected readonly isProfileDropdownOpen = signal(false);
  protected readonly selectedLocation = signal('Sri Lanka');
  protected readonly userAvatar = signal('assets/branding/ceylongo-logo.png');

  // Reactive authentication state derived directly from AuthService
  protected readonly isLoggedIn = this.authService.isAuthenticated;
  protected readonly currentUser = this.authService.currentUser;

  protected readonly userName = computed(() => {
    return this.currentUser()?.name ?? '';
  });

  protected readonly userInitial = computed(() => {
    const name = this.userName().trim();
    return name ? name.charAt(0).toUpperCase() : 'U';
  });

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
    this.isMobileMenuOpen.set(false);
  }
}
