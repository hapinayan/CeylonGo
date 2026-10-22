import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-state',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading-state.component.html',
  styleUrl: './loading-state.component.scss',
})
export class LoadingStateComponent {
  readonly mode = input<'spinner' | 'skeleton'>('spinner');
  readonly message = input<string>('Loading...');
  readonly skeletonCount = input<number>(3);
  readonly size = input<'sm' | 'md' | 'lg'>('md');

  protected get skeletonArray(): number[] {
    return Array.from({ length: this.skeletonCount() }, (_, i) => i);
  }
}
