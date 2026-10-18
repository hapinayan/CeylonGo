import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthLayoutComponent } from '../../components/auth-layout/auth-layout.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, AuthLayoutComponent],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  private readonly fb = inject(FormBuilder);

  readonly isSubmitting = signal(false);
  readonly demoSuccessMessage = signal<string | null>(null);

  readonly forgotForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  isFieldInvalid(fieldName: string): boolean {
    const field = this.forgotForm.get(fieldName);
    if (!field) return false;
    return !!(field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string | null {
    const field = this.forgotForm.get(fieldName);
    if (!field || !field.errors || !(field.dirty || field.touched)) {
      return null;
    }
    if (field.errors['required']) {
      return 'Email address is required.';
    }
    if (field.errors['email']) {
      return 'Please enter a valid email address (e.g. traveler@ceylongo.com).';
    }
    return 'Invalid field value.';
  }

  onSubmit(): void {
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.demoSuccessMessage.set(null);

    // Frontend-only demo feedback without sending real emails
    setTimeout(() => {
      this.isSubmitting.set(false);
      const email = this.forgotForm.get('email')?.value;
      this.demoSuccessMessage.set(
        `Demo Mode: Password reset link simulated for ${email}. No real email was sent (client-side prototype mode).`
      );
    }, 600);
  }

  dismissDemoBanner(): void {
    this.demoSuccessMessage.set(null);
  }
}
