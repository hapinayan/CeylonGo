import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-error-state',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './error-state.component.html',
  styleUrl: './error-state.component.scss',
})
export class ErrorStateComponent {
  readonly title = input<string>('Unable to Load Content');
  readonly message = input<string>('We encountered an unexpected issue while loading this information. Please check your connection and try again.');
  readonly retryText = input<string>('Try Again');
  readonly showRetry = input<boolean>(true);

  readonly retry = output<void>();
}
