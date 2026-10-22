import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../button/button.component';
import { FilterState } from '../../models/ui.models';

@Component({
  selector: 'app-filter-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  templateUrl: './filter-panel.component.html',
  styleUrl: './filter-panel.component.scss',
})
export class FilterPanelComponent {
  readonly title = input<string>('Filters');
  readonly showCategoryFilter = input<boolean>(true);
  readonly showDistrictFilter = input<boolean>(true);
  readonly showPriceFilter = input<boolean>(true);
  readonly showRatingFilter = input<boolean>(true);

  readonly filterChange = output<FilterState>();
  readonly reset = output<void>();

  // Filter state signals
  protected readonly selectedDistrict = signal<string>('all');
  protected readonly minPrice = signal<number | undefined>(undefined);
  protected readonly maxPrice = signal<number | undefined>(undefined);
  protected readonly minRating = signal<number | undefined>(undefined);
  protected readonly selectedCategory = signal<string>('all');

  protected readonly districts = [
    { code: 'all', name: 'All Districts' },
    { code: 'kandy', name: 'Kandy (Central)' },
    { code: 'badulla', name: 'Badulla / Ella' },
    { code: 'galle', name: 'Galle (Southern)' },
    { code: 'matara', name: 'Matara / Mirissa' },
    { code: 'matale', name: 'Matale / Sigiriya' },
    { code: 'nuwara-eliya', name: 'Nuwara Eliya' },
    { code: 'jaffna', name: 'Jaffna (Northern)' },
    { code: 'trincomalee', name: 'Trincomalee' },
    { code: 'colombo', name: 'Colombo (Western)' },
  ];

  protected readonly categories = [
    { id: 'all', label: 'All Services' },
    { id: 'homestays', label: 'Homestays' },
    { id: 'experiences', label: 'Experiences & Activities' },
    { id: 'eco-tourism', label: 'Eco-Tourism' },
    { id: 'tour-guides', label: 'Local Tour Guides' },
    { id: 'artisan', label: 'Artisan & Craft' },
    { id: 'rentals', label: 'Bike & Cycle Rentals' },
  ];

  protected readonly ratings = [
    { value: 0, label: 'Any Rating' },
    { value: 4.0, label: '★ 4.0+' },
    { value: 4.5, label: '★ 4.5+' },
    { value: 4.8, label: '★ 4.8+' },
  ];

  protected applyFilters(): void {
    this.filterChange.emit({
      district: this.selectedDistrict() !== 'all' ? this.selectedDistrict() : undefined,
      category: this.selectedCategory() !== 'all' ? this.selectedCategory() : undefined,
      minPrice: this.minPrice(),
      maxPrice: this.maxPrice(),
      minRating: this.minRating(),
    });
  }

  protected resetFilters(): void {
    this.selectedDistrict.set('all');
    this.selectedCategory.set('all');
    this.minPrice.set(undefined);
    this.maxPrice.set(undefined);
    this.minRating.set(undefined);

    this.reset.emit();
    this.applyFilters();
  }
}
