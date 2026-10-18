import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthLayoutComponent } from '../../components/auth-layout/auth-layout.component';
import { passwordMatchValidator } from '../../validators/password-match.validator';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, AuthLayoutComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);

  readonly showPassword = signal(false);
  readonly showConfirmPassword = signal(false);
  readonly isSubmitting = signal(false);
  readonly demoSuccessMessage = signal<string | null>(null);

  readonly registerForm: FormGroup = this.fb.group(
    {
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      agreeTerms: [false, [Validators.requiredTrue]],
    },
    {
      validators: [passwordMatchValidator('password', 'confirmPassword')],
    }
  );

  togglePasswordVisibility(): void {
    this.showPassword.update((val) => !val);
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.update((val) => !val);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    if (!field) return false;
    return !!(field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string | null {
    const field = this.registerForm.get(fieldName);
    if (!field || !field.errors || !(field.dirty || field.touched)) {
      return null;
    }
    if (field.errors['required']) {
      switch (fieldName) {
        case 'fullName':
          return 'Full name is required.';
        case 'email':
          return 'Email address is required.';
        case 'password':
          return 'Password is required.';
        case 'confirmPassword':
          return 'Please confirm your password.';
        case 'agreeTerms':
          return 'You must agree to the Terms of Service and Privacy Policy.';
      }
    }
    if (field.errors['requiredTrue']) {
      return 'You must agree to the Terms of Service and Privacy Policy.';
    }
    if (field.errors['minlength']) {
      const requiredLen = field.errors['minlength'].requiredLength;
      return `${fieldName === 'fullName' ? 'Full name' : 'Password'} must be at least ${requiredLen} characters long.`;
    }
    if (field.errors['email']) {
      return 'Please enter a valid email address (e.g. traveler@ceylongo.com).';
    }
    if (field.errors['passwordMismatch']) {
      return 'Passwords do not match.';
    }
    return 'Invalid field value.';
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.demoSuccessMessage.set(null);

    // Frontend-only demo feedback without database or backend API call
    setTimeout(() => {
      this.isSubmitting.set(false);
      const name = this.registerForm.get('fullName')?.value;
      const email = this.registerForm.get('email')?.value;
      this.demoSuccessMessage.set(
        `Demo Mode: Registration validation verified for ${name} (${email}). In accordance with strict guidelines, no account was created in any database.`
      );
    }, 600);
  }

  dismissDemoBanner(): void {
    this.demoSuccessMessage.set(null);
  }
}
