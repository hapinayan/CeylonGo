import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QUICK_BENEFITS_DATA } from '../../data/home-mock-data';
import { QuickBenefitItem } from '../../../../shared/models/tourism.models';

@Component({
  selector: 'app-category-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-bar.component.html',
  styleUrl: './category-bar.component.scss',
})
export class CategoryBarComponent {
  protected readonly benefits: QuickBenefitItem[] = QUICK_BENEFITS_DATA;
}
