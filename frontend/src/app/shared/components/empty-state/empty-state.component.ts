import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.scss',
})
export class EmptyStateComponent {
  readonly title = input<string>('No items found');
  readonly description = input<string>('We could not find anything matching your search criteria. Try adjusting your filters or search terms.');
  readonly actionText = input<string | undefined>(undefined);
  readonly iconType = input<'search' | 'bookmark' | 'trip' | 'general'>('search');

  readonly action = output<void>();
}
