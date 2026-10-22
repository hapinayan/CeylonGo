import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-section-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './section-header.component.html',
  styleUrl: './section-header.component.scss',
})
export class SectionHeaderComponent {
  readonly kicker = input<string | undefined>(undefined);
  readonly title = input.required<string>();
  readonly highlightText = input<string | undefined>(undefined);
  readonly subtitle = input<string | undefined>(undefined);
  readonly align = input<'left' | 'center'>('center');
}
