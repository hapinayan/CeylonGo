import { Component, input, output, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss',
})
export class ConfirmationDialogComponent {
  readonly isOpen = input.required<boolean>();
  readonly title = input<string>('Confirm Action');
  readonly message = input<string>('Are you sure you want to proceed?');
  readonly confirmText = input<string>('Confirm');
  readonly cancelText = input<string>('Cancel');
  readonly variant = input<'primary' | 'danger' | 'warning'>('primary');
  readonly loading = input<boolean>(false);

  readonly confirm = output<void>();
  readonly cancel = output<void>();
  readonly close = output<void>();

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen() && !this.loading()) {
      this.handleCancel();
    }
  }

  protected handleConfirm(): void {
    if (!this.loading()) {
      this.confirm.emit();
    }
  }

  protected handleCancel(): void {
    if (!this.loading()) {
      this.cancel.emit();
      this.close.emit();
    }
  }
}
