import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface ItineraryDayPreview {
  day: string;
  title: string;
  imageUrl: string;
}

@Component({
  selector: 'app-ai-planner-banner',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './ai-planner-banner.component.html',
  styleUrl: './ai-planner-banner.component.scss',
})
export class AiPlannerBannerComponent {
  protected readonly previewDays: ItineraryDayPreview[] = [
    {
      day: 'Day 1',
      title: 'Jaffna Heritage Tour',
      imageUrl: 'assets/images/destinations/dest_jaffna.jpg',
    },
    {
      day: 'Day 2',
      title: 'Trincomalee Beaches',
      imageUrl: 'assets/images/destinations/dest_trincomalee.jpg',
    },
    {
      day: 'Day 3',
      title: 'Local Experiences',
      imageUrl: 'assets/images/experiences/exp_sea_farming.jpg',
    },
    {
      day: 'Day 4',
      title: 'Batticaloa Lagoon',
      imageUrl: 'assets/images/destinations/dest_batticaloa.jpg',
    },
  ];
}
