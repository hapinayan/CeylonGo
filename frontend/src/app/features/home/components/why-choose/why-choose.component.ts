import { Component } from '@angular/core';
import { MetricItem } from '../../../../shared/models/tourism.models';
import { WHY_CHOOSE_METRICS_DATA } from '../../data/home-mock-data';

@Component({
  selector: 'app-why-choose',
  standalone: true,
  imports: [],
  templateUrl: './why-choose.component.html',
  styleUrl: './why-choose.component.scss',
})
export class WhyChooseComponent {
  protected readonly metrics: MetricItem[] = WHY_CHOOSE_METRICS_DATA;
}
