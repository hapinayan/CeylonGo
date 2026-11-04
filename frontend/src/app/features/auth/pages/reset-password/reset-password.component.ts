import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthLayoutComponent } from '../../components/auth-layout/auth-layout.component';
import { passwordMatchValidator } from '../../validators/password-match.validator';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, AuthLayoutComponent],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  private readonly fb = inject(FormBuilder);

  readonly showNewPassword = signal(false);
  readonly showConfirmNewPassword = signal(false);
  readonly isSubmitting = signal(false);
  readonly demoSuccessMessage = signal<string | null>(null);

  readonly resetForm: FormGroup = this.fb.group(
    {
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmNewPassword: ['', [Validators.required]],
    },
    {
      validators: [passwordMatchValidator('newPassword', 'confirmNewPassword')],
    }
  );

  toggleNewPasswordVisibility(): void {
    this.showNewPassword.update((val) => !val);
  }

  toggleConfirmNewPasswordVisibility(): void {
    this.showConfirmNewPassword.update((val) => !val);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.resetForm.get(fieldName);
    if (!field) return false;
    return !!(field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string | null {
    const field = this.resetForm.get(fieldName);
    if (!field || !field.errors || !(field.dirty || field.touched)) {
      return null;
    }
    if (field.errors['required']) {
      return fieldName === 'newPassword'
        ? 'New password is required.'
        : 'Please confirm your new password.';
    }
    if (field.errors['minlength']) {
      return 'Password must be at least 8 characters long.';
    }
    if (field.errors['passwordMismatch']) {
      return 'Passwords do not match.';
    }
    return 'Invalid field value.';
  }

  onSubmit(): void {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.demoSuccessMessage.set(null);

    // Frontend-only demo feedback without updating database or token validation
    setTimeout(() => {
      this.isSubmitting.set(false);
      this.demoSuccessMessage.set(
        'Demo Mode: Password reset simulation succeeded. No password was updated in any database.'
      );
    }, 600);
  }

  dismissDemoBanner(): void {
    this.demoSuccessMessage.set(null);
  }
}
