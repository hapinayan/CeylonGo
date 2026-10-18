import { Component, ElementRef, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DestinationItem } from '../../../../shared/models/tourism.models';
import { DESTINATIONS_DATA } from '../../data/home-mock-data';

@Component({
  selector: 'app-popular-destinations',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './popular-destinations.component.html',
  styleUrl: './popular-destinations.component.scss',
})
export class PopularDestinationsComponent {
  protected readonly destinations: DestinationItem[] = DESTINATIONS_DATA;
  protected readonly scrollContainer = viewChild<ElementRef<HTMLDivElement>>('cardsContainer');

  protected scrollLeft(): void {
    const el = this.scrollContainer()?.nativeElement;
    if (el) {
      el.scrollBy({ left: -280, behavior: 'smooth' });
    }
  }

  protected scrollRight(): void {
    const el = this.scrollContainer()?.nativeElement;
    if (el) {
      el.scrollBy({ left: 280, behavior: 'smooth' });
    }
  }
}
