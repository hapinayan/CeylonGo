import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthLayoutComponent } from '../../components/auth-layout/auth-layout.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, AuthLayoutComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);

  readonly showPassword = signal(false);
  readonly isSubmitting = signal(false);
  readonly demoSuccessMessage = signal<string | null>(null);

  readonly loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    rememberMe: [false],
  });

  togglePasswordVisibility(): void {
    this.showPassword.update((val) => !val);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string | null {
    const field = this.loginForm.get(fieldName);
    if (!field || !field.errors || !(field.dirty || field.touched)) {
      return null;
    }
    if (field.errors['required']) {
      return fieldName === 'email' ? 'Email address is required.' : 'Password is required.';
    }
    if (field.errors['email']) {
      return 'Please enter a valid email address (e.g. traveler@ceylongo.com).';
    }
    return 'Invalid field value.';
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.demoSuccessMessage.set(null);

    // Frontend-only demo feedback simulation without authentication session
    setTimeout(() => {
      this.isSubmitting.set(false);
      const email = this.loginForm.get('email')?.value;
      this.demoSuccessMessage.set(
        `Demo Mode: Client-side validation succeeded for ${email}. Per security protocol, no mock session was created and no backend call was executed.`
      );
    }, 600);
  }

  dismissDemoBanner(): void {
    this.demoSuccessMessage.set(null);
  }
}
