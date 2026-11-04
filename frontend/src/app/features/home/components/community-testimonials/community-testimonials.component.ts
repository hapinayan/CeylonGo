import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TestimonialItem } from '../../../../shared/models/tourism.models';
import { TESTIMONIALS_DATA } from '../../data/home-mock-data';

@Component({
  selector: 'app-community-testimonials',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './community-testimonials.component.html',
  styleUrl: './community-testimonials.component.scss',
})
export class CommunityTestimonialsComponent {
  protected readonly testimonials: TestimonialItem[] = TESTIMONIALS_DATA;
}
