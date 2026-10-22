import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { HomestayItem } from '../../../../shared/models/tourism.models';
import { HOMESTAYS_DATA } from '../../data/home-mock-data';

@Component({
  selector: 'app-featured-homestays',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  templateUrl: './featured-homestays.component.html',
  styleUrl: './featured-homestays.component.scss',
})
export class FeaturedHomestaysComponent {
  protected readonly homestays: HomestayItem[] = HOMESTAYS_DATA;

  protected toggleFavorite(item: HomestayItem, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    item.isFavorite = !item.isFavorite;
  }
}
