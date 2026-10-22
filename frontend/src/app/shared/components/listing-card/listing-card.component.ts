import { Component, input, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListingCardData } from '../../models/ui.models';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-listing-card',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './listing-card.component.html',
  styleUrl: './listing-card.component.scss',
})
export class ListingCardComponent {
  readonly item = input.required<ListingCardData>();
  readonly showFavorite = input<boolean>(true);
  readonly ctaLabel = input<string>('View Details');

  readonly cardClick = output<ListingCardData>();
  readonly favoriteToggle = output<{ id: string; isFavorite: boolean }>();

  protected readonly isFav = signal<boolean>(false);

  constructor() {
    effect(() => {
      this.isFav.set(!!this.item().isFavorite);
    });
  }

  protected handleCardClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.closest('.cg-listing-card__fav-btn') || target.closest('a')) {
      return;
    }
    this.cardClick.emit(this.item());
  }

  protected toggleFavorite(event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();
    const nextState = !this.isFav();
    this.isFav.set(nextState);
    this.favoriteToggle.emit({ id: this.item().id, isFavorite: nextState });
  }

  protected formatPrice(price: number): string {
    return price.toLocaleString('en-US');
  }
}
