import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.scss',
})
export class HeroSectionComponent {
  protected readonly destination = signal('');
  protected readonly checkInDate = signal('');
  protected readonly checkOutDate = signal('');
  protected readonly guestCount = signal(1);
  protected readonly isGuestDropdownOpen = signal(false);
  protected readonly searchSubmitted = signal(false);

  protected toggleGuestDropdown(): void {
    this.isGuestDropdownOpen.update((v) => !v);
  }

  protected setGuests(count: number): void {
    this.guestCount.set(Math.max(1, count));
    this.isGuestDropdownOpen.set(false);
  }

  protected onSearch(): void {
    this.searchSubmitted.set(true);
    setTimeout(() => this.searchSubmitted.set(false), 3000);
  }
}
