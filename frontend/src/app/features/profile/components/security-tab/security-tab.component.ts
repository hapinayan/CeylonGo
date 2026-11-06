// =============================================================================
// CeylonGo — Module 07: Security & Login Tab Component
// Architecture: Angular 21 Standalone + Reactive Forms + Signals
// Security Policy: All security actions are client-side simulations (Demo Mode).
// Passwords and real tokens are NEVER stored, persisted, or dispatched.
// =============================================================================

import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ButtonComponent,
  FormInputComponent,
  ConfirmationDialogComponent,
} from '../../../../shared/components';
import { ProfileService } from '../../services/profile.service';
import { passwordMatchValidator } from '../../validators/password-match.validator';

@Component({
  selector: 'app-security-tab',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    FormInputComponent,
    ConfirmationDialogComponent,
  ],
  templateUrl: './security-tab.component.html',
  styleUrl: './security-tab.component.scss',
})
export class SecurityTabComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  protected readonly profileService = inject(ProfileService);

  // In-memory profile state from ProfileService
  protected readonly profile = this.profileService.profile;

  // Local state signals
  protected readonly isSavingPassword = signal<boolean>(false);
  protected readonly isToggling2Fa = signal<boolean>(false);
  protected readonly isRevokingSession = signal<string | null>(null);
  protected readonly successNotice = signal<string | null>(null);
  protected readonly errorNotice = signal<string | null>(null);

  // Confirmation dialog states
  protected readonly isDeactivateDialogOpen = signal<boolean>(false);
  protected readonly isDeleteDialogOpen = signal<boolean>(false);
  protected readonly isDialogLoading = signal<boolean>(false);

  // Password visibility toggles
  protected readonly showCurrentPassword = signal<boolean>(false);
  protected readonly showNewPassword = signal<boolean>(false);
  protected readonly showConfirmPassword = signal<boolean>(false);

  // Password Change Reactive Form
  protected passwordForm!: FormGroup;

  ngOnInit(): void {
    this.initPasswordForm();
  }

  protected initPasswordForm(): void {
    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', [Validators.required]],
        newPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/
            ),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: passwordMatchValidator('newPassword', 'confirmPassword'),
      }
    );
  }

  /**
   * Password strength scoring (0-4) based on length, cases, numbers, symbols
   */
  protected get passwordStrengthScore(): number {
    const val = this.passwordForm?.get('newPassword')?.value || '';
    if (!val) return 0;
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val) && /[a-z]/.test(val)) score++;
    if (/\d/.test(val)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(val)) score++;
    return score;
  }

  protected get passwordStrengthLabel(): string {
    switch (this.passwordStrengthScore) {
      case 1:
        return 'Weak';
      case 2:
        return 'Fair';
      case 3:
        return 'Good';
      case 4:
        return 'Strong';
      default:
        return 'Too short';
    }
  }

  /**
   * Field validation helper
   */
  protected isFieldInvalid(fieldName: string): boolean {
    const control = this.passwordForm.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  protected getFieldError(fieldName: string): string | undefined {
    const control = this.passwordForm.get(fieldName);
    if (!control || !control.errors || !(control.dirty || control.touched)) {
      return undefined;
    }

    if (control.errors['required']) {
      return 'This field is required.';
    }
    if (control.errors['minlength']) {
      return 'Password must be at least 8 characters long.';
    }
    if (control.errors['pattern']) {
      return 'Password must include uppercase, lowercase, numbers, and symbols.';
    }
    if (control.errors['passwordMismatch']) {
      return 'Passwords do not match.';
    }

    return 'Invalid field value.';
  }

  /**
   * Handle simulated password change submission
   */
  protected async onPasswordSubmit(): Promise<void> {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      this.errorNotice.set('Please resolve the password validation errors below.');
      return;
    }

    this.isSavingPassword.set(true);
    this.successNotice.set(null);
    this.errorNotice.set(null);

    const values = this.passwordForm.value;

    const result = await this.profileService.changePassword({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
      confirmPassword: values.confirmPassword,
    });

    this.isSavingPassword.set(false);

    // Immediately clear all sensitive password fields from memory
    this.passwordForm.reset();
    this.passwordForm.markAsPristine();

    if (result.success) {
      this.successNotice.set(
        'DEMO MODE: Password validation succeeded client-side. Per security guidelines, passwords are never stored in browser memory, tokens, or localStorage. Secure BCrypt hashing on MSSQL will be connected with backend rollout.'
      );
    } else {
      this.errorNotice.set(result.message);
    }
  }

  /**
   * Handle simulated 2FA toggle
   */
  protected async onToggle2Fa(): Promise<void> {
    this.isToggling2Fa.set(true);
    this.successNotice.set(null);
    this.errorNotice.set(null);

    const result = await this.profileService.toggleTwoFactor();
    this.isToggling2Fa.set(false);

    if (result.success) {
      this.successNotice.set(result.message);
    }
  }

  /**
   * Handle simulated session revocation
   */
  protected async onRevokeSession(sessionId: string): Promise<void> {
    this.isRevokingSession.set(sessionId);
    const result = await this.profileService.revokeSession(sessionId);
    this.isRevokingSession.set(null);

    if (result.success) {
      this.successNotice.set(
        'DEMO MODE: Session revocation simulated in memory. Real session token blacklisting requires backend Redis/MSSQL integration.'
      );
    }
  }

  /**
   * Deactivation confirmation flow
   */
  protected openDeactivateDialog(): void {
    this.isDeactivateDialogOpen.set(true);
  }

  protected async confirmDeactivation(): Promise<void> {
    this.isDialogLoading.set(true);
    const result = await this.profileService.deactivateAccount();
    this.isDialogLoading.set(false);
    this.isDeactivateDialogOpen.set(false);

    this.successNotice.set(
      'DEMO MODE: Account deactivation simulated. No database records in MSSQL were affected.'
    );
  }

  /**
   * Deletion confirmation flow
   */
  protected openDeleteDialog(): void {
    this.isDeleteDialogOpen.set(true);
  }

  protected async confirmDeletion(): Promise<void> {
    this.isDialogLoading.set(true);
    const result = await this.profileService.deleteAccount();
    this.isDialogLoading.set(false);
    this.isDeleteDialogOpen.set(false);

    this.successNotice.set(
      'DEMO MODE: Account deletion simulated. In-memory demo session has been reset.'
    );
  }

  protected dismissNotice(): void {
    this.successNotice.set(null);
    this.errorNotice.set(null);
  }
}
