import { Component, signal, HostListener, ElementRef } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  protected readonly isMobileMenuOpen = signal(false);
  protected readonly isLocationDropdownOpen = signal(false);
  protected readonly isProfileDropdownOpen = signal(false);
  protected readonly selectedLocation = signal('Sri Lanka');
  protected readonly userName = signal('Hapinayan');
  protected readonly userAvatar = signal('assets/branding/ceylongo-logo.png');
  protected readonly isLoggedIn = signal(true);

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

  constructor(private readonly elementRef: ElementRef) {}

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
    this.isLoggedIn.set(false);
    this.isProfileDropdownOpen.set(false);
  }
}
