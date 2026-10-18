import { Component, input } from '@angular/core';
import { CategoryItem } from '../../../../shared/models/tourism.models';
import { CATEGORIES_DATA } from '../../data/home-mock-data';

@Component({
  selector: 'app-category-bar',
  standalone: true,
  templateUrl: './category-bar.component.html',
  styleUrl: './category-bar.component.scss',
})
export class CategoryBarComponent {
  protected readonly categories: CategoryItem[] = CATEGORIES_DATA;
}
