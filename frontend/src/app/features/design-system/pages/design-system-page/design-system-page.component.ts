import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ButtonComponent,
  PageContainerComponent,
  PageHeaderComponent,
  SectionHeaderComponent,
  SearchInputComponent,
  FormInputComponent,
  SelectComponent,
  FilterPanelComponent,
  ListingCardComponent,
  LoadingStateComponent,
  EmptyStateComponent,
  ErrorStateComponent,
  ConfirmationDialogComponent,
  BreadcrumbsComponent,
  BreadcrumbItem,
  SelectOption,
  ListingCardData,
  FilterState,
} from '../../../../shared/components';

@Component({
  selector: 'app-design-system-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonComponent,
    PageContainerComponent,
    PageHeaderComponent,
    SectionHeaderComponent,
    SearchInputComponent,
    FormInputComponent,
    SelectComponent,
    FilterPanelComponent,
    ListingCardComponent,
    LoadingStateComponent,
    EmptyStateComponent,
    ErrorStateComponent,
    ConfirmationDialogComponent,
    BreadcrumbsComponent,
  ],
  templateUrl: './design-system-page.component.html',
  styleUrl: './design-system-page.component.scss',
})
export class DesignSystemPageComponent {
  // Breadcrumbs sample
  protected readonly breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Documentation', url: '/design-system' },
    { label: 'UI Design System' },
  ];

  // Select dropdown sample
  protected readonly districtOptions: SelectOption[] = [
    { label: 'Badulla / Ella District', value: 'ella', icon: '⛰️' },
    { label: 'Kandy Central Highlands', value: 'kandy', icon: '🏛️' },
    { label: 'Galle Coastal District', value: 'galle', icon: '🌊' },
    { label: 'Matale / Sigiriya', value: 'sigiriya', icon: '🦁' },
    { label: 'Nuwara Eliya Tea Country', value: 'nuwara-eliya', icon: '🍃' },
  ];
  protected readonly selectedDistrict = signal<string>('ella');

  // Input samples
  protected readonly sampleInputText = signal('Sri Lanka Homestay');
  protected readonly sampleInputError = signal('Please enter a valid guest email');

  // Search input sample
  protected readonly lastSearchQuery = signal<string>('');

  // Dialog sample
  protected readonly isDialogOpen = signal<boolean>(false);
  protected readonly dialogVariant = signal<'primary' | 'danger' | 'warning'>('danger');

  // Loading state toggle
  protected readonly loadingMode = signal<'spinner' | 'skeleton'>('spinner');

  // Listing card sample data
  protected readonly sampleListings: ListingCardData[] = [
    {
      id: 'hs-1',
      title: 'Ella Misty Mountain View Homestay',
      location: 'Ella, Badulla District',
      imageUrl: 'assets/images/homestays/homestay_ella.jpg',
      price: 12500,
      priceUnit: 'night',
      rating: 4.95,
      reviewCount: 48,
      badge: 'Superhost',
      badgeVariant: 'accent',
      isFavorite: true,
    },
    {
      id: 'exp-1',
      title: 'Traditional Ceylon Tea Plucking & Tasting Tour',
      location: 'Nuwara Eliya',
      imageUrl: 'assets/images/experiences/exp_tea.jpg',
      price: 6500,
      priceUnit: 'person',
      rating: 4.88,
      reviewCount: 32,
      badge: 'Eco Friendly',
      badgeVariant: 'success',
      isFavorite: false,
    },
    {
      id: 'hs-2',
      title: 'Mirissa Beachside Coconut Breeze Cottage',
      location: 'Mirissa, Matara',
      imageUrl: 'assets/images/homestays/homestay_beachside.jpg',
      price: 16000,
      priceUnit: 'night',
      rating: 4.92,
      reviewCount: 65,
      badge: 'Featured',
      badgeVariant: 'primary',
      isFavorite: false,
    },
  ];

  protected onFilterChange(filters: FilterState): void {
    console.log('Filter changed:', filters);
  }

  protected openConfirmDialog(variant: 'primary' | 'danger' | 'warning'): void {
    this.dialogVariant.set(variant);
    this.isDialogOpen.set(true);
  }

  protected handleDialogConfirm(): void {
    this.isDialogOpen.set(false);
    alert('Action confirmed successfully!');
  }
}
