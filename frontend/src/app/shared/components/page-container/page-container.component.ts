import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ContainerSize = 'sm' | 'md' | 'lg' | 'full';
export type ContainerPadding = 'none' | 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-page-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="cg-page-container cg-page-container--{{ size() }} cg-page-container--pad-{{ padding() }}"
      [class.cg-page-container--centered]="centered()"
    >
      <ng-content></ng-content>
    </div>
  `,
  styles: [
    `
      .cg-page-container {
        width: 100%;
        margin-left: auto;
        margin-right: auto;
        box-sizing: border-box;

        &--sm {
          max-width: 768px;
        }

        &--md {
          max-width: 1024px;
        }

        &--lg {
          max-width: var(--cg-container-max, 1280px);
        }

        &--full {
          max-width: 100%;
        }

        &--pad-none {
          padding-left: 0;
          padding-right: 0;
        }

        &--pad-sm {
          padding-left: var(--cg-space-3);
          padding-right: var(--cg-space-3);
        }

        &--pad-md {
          padding-left: var(--cg-container-padding, 1.5rem);
          padding-right: var(--cg-container-padding, 1.5rem);
        }

        &--pad-lg {
          padding-left: var(--cg-space-8);
          padding-right: var(--cg-space-8);
        }

        &--centered {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
      }
    `,
  ],
})
export class PageContainerComponent {
  readonly size = input<ContainerSize>('lg');
  readonly padding = input<ContainerPadding>('md');
  readonly centered = input<boolean>(false);
}
