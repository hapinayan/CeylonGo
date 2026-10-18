import { Component, signal } from '@angular/core';
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
  protected readonly isLangDropdownOpen = signal(false);
  protected readonly selectedLanguage = signal('EN');

  protected readonly languages = [
    { code: 'EN', label: 'English', flag: '🇬🇧' },
    { code: 'SI', label: 'සිංහල (Sinhala)', flag: '🇱🇰' },
    { code: 'TA', label: 'தமிழ் (Tamil)', flag: '🇱🇰' },
  ];

  protected toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((v) => !v);
  }

  protected closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  protected toggleLangDropdown(): void {
    this.isLangDropdownOpen.update((v) => !v);
  }

  protected selectLanguage(code: string): void {
    this.selectedLanguage.set(code);
    this.isLangDropdownOpen.set(false);
  }
}
