import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TourismServiceItem } from '../../../../shared/models/tourism.models';
import { TOURISM_SERVICES_DATA } from '../../data/home-mock-data';

@Component({
  selector: 'app-tourism-services',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './tourism-services.component.html',
  styleUrl: './tourism-services.component.scss',
})
export class TourismServicesComponent {
  protected readonly services: TourismServiceItem[] = TOURISM_SERVICES_DATA;
}
