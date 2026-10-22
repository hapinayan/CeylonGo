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
  protected readonly aiQuery = signal('');
  protected readonly travelDates = signal('');
  protected readonly guestCount = signal(2);
  protected readonly isGuestDropdownOpen = signal(false);
  protected readonly isDateDropdownOpen = signal(false);
  protected readonly searchSubmitted = signal(false);

  constructor(private readonly router: Router) {}

  protected toggleGuestDropdown(): void {
    this.isDateDropdownOpen.set(false);
    this.isGuestDropdownOpen.update((v) => !v);
  }

  protected toggleDateDropdown(): void {
    this.isGuestDropdownOpen.set(false);
    this.isDateDropdownOpen.update((v) => !v);
  }

  protected setGuests(count: number): void {
    this.guestCount.set(Math.max(1, count));
    this.isGuestDropdownOpen.set(false);
  }

  protected selectDateRange(range: string): void {
    this.travelDates.set(range);
    this.isDateDropdownOpen.set(false);
  }

  protected onGeneratePlan(): void {
    this.searchSubmitted.set(true);
    setTimeout(() => {
      this.searchSubmitted.set(false);
      this.router.navigate(['/ai-planner'], {
        queryParams: {
          q: this.aiQuery() || 'Sri Lanka 7-day cultural homestay tour',
          guests: this.guestCount(),
          dates: this.travelDates() || 'Upcoming',
        },
      });
    }, 700);
  }
}
