import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.scss',
})
export class HeroSectionComponent {
  protected readonly destination = signal('');
  protected readonly checkIn = signal('');
  protected readonly guestCount = signal(2);

  protected readonly isGuestDropdownOpen = signal(false);
  protected readonly isDateDropdownOpen = signal(false);
  protected readonly isDestDropdownOpen = signal(false);
  protected readonly searchSubmitted = signal(false);

  protected readonly popularDestinations = [
    'Jaffna',
    'Trincomalee',
    'Batticaloa',
    'Mannar',
    'Nilaveli',
    'Arugam Bay',
  ];

  protected readonly dateOptions = [
    'This Weekend',
    'Next Week (7 Days)',
    'Oct 25 - Nov 01',
    'Nov 05 - Nov 12',
    'Flexible Dates',
  ];

  constructor(private readonly router: Router) {}

  protected toggleDestDropdown(): void {
    this.isGuestDropdownOpen.set(false);
    this.isDateDropdownOpen.set(false);
    this.isDestDropdownOpen.update((v) => !v);
  }

  protected selectDestination(dest: string): void {
    this.destination.set(dest);
    this.isDestDropdownOpen.set(false);
  }

  protected toggleDateDropdown(): void {
    this.isGuestDropdownOpen.set(false);
    this.isDestDropdownOpen.set(false);
    this.isDateDropdownOpen.update((v) => !v);
  }

  protected selectDateRange(range: string): void {
    this.checkIn.set(range);
    this.isDateDropdownOpen.set(false);
  }

  protected toggleGuestDropdown(): void {
    this.isDateDropdownOpen.set(false);
    this.isDestDropdownOpen.set(false);
    this.isGuestDropdownOpen.update((v) => !v);
  }

  protected setGuests(count: number, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.guestCount.set(Math.max(1, count));
  }

  protected closeAllDropdowns(): void {
    this.isGuestDropdownOpen.set(false);
    this.isDateDropdownOpen.set(false);
    this.isDestDropdownOpen.set(false);
  }

  protected onSearch(): void {
    this.closeAllDropdowns();
    this.searchSubmitted.set(true);

    setTimeout(() => {
      this.searchSubmitted.set(false);
      this.router.navigate(['/homestays'], {
        queryParams: {
          destination: this.destination() || undefined,
          dates: this.checkIn() || undefined,
          guests: this.guestCount(),
        },
      });
    }, 400);
  }
}
