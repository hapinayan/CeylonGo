import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthLayoutComponent } from '../../components/auth-layout/auth-layout.component';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, AuthLayoutComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  readonly showPassword = signal(false);
  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

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

  dismissErrorMessage(): void {
    this.errorMessage.set(null);
  }

  onSubmit(): void {
    if (this.isSubmitting()) {
      return;
    }

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.errorMessage.set(null);
    this.isSubmitting.set(true);

    const email = this.loginForm.get('email')?.value?.trim() ?? '';
    const password = this.loginForm.get('password')?.value ?? '';

    this.authService
      .login({ email, password })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.router.navigate(['/']);
        },
        error: (err: unknown) => {
          this.isSubmitting.set(false);
          this.handleLoginError(err);
        },
      });
  }

  private handleLoginError(err: unknown): void {
    if (err instanceof HttpErrorResponse) {
      if (err.status === 401) {
        this.errorMessage.set(
          'Invalid email or password. Please check your credentials and try again.'
        );
      } else if (err.status === 0) {
        this.errorMessage.set(
          'Unable to connect to CeylonGo server. Please check your network connection and try again.'
        );
      } else if (err.status >= 500) {
        this.errorMessage.set('CeylonGo server is currently unavailable. Please try again later.');
      } else {
        this.errorMessage.set('Sign in failed. Please verify your information and try again.');
      }
      return;
    }

    if (err instanceof Error) {
      if (err.message.includes('Tourist')) {
        this.errorMessage.set(
          'Access restricted: This portal is for tourists only. Vendor and Admin accounts cannot sign in here.'
        );
      } else {
        this.errorMessage.set('Unable to complete sign in. Please try again.');
      }
      return;
    }

    this.errorMessage.set('An unexpected error occurred. Please try again.');
  }
}
