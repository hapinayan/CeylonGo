// =============================================================================
// CeylonGo — Module 07: Preferences Tab Component
// Architecture: Angular 21 Standalone + Reactive Forms + Signals
// =============================================================================

import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonComponent, SelectComponent } from '../../../../shared/components';
import { ProfileService } from '../../services/profile.service';
import {
  LANGUAGE_OPTIONS,
  CURRENCY_OPTIONS,
  PreferencesSettings,
} from '../../models/profile.models';

@Component({
  selector: 'app-preferences-tab',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, SelectComponent],
  templateUrl: './preferences-tab.component.html',
  styleUrl: './preferences-tab.component.scss',
})
export class PreferencesTabComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  protected readonly profileService = inject(ProfileService);

  // Readonly reference to in-memory profile signal
  protected readonly profile = this.profileService.profile;

  // Options
  protected readonly languageOptions = LANGUAGE_OPTIONS;
  protected readonly currencyOptions = CURRENCY_OPTIONS;

  // Local state signals
  protected readonly isSaving = signal<boolean>(false);
  protected readonly successNotice = signal<string | null>(null);
  protected readonly errorNotice = signal<string | null>(null);

  // Reactive Form
  protected preferencesForm!: FormGroup;

  ngOnInit(): void {
    this.initForm();
  }

  /**
   * Initialize form controls from in-memory ProfileService state
   */
  protected initForm(): void {
    const prefs = this.profile().preferences;

    this.preferencesForm = this.fb.group({
      language: [prefs.language, [Validators.required]],
      currency: [prefs.currency, [Validators.required]],
      emailBooking: [prefs.notifications.bookingConfirmations.email],
      emailHost: [prefs.notifications.hostMessages.email],
      emailPromos: [prefs.notifications.culturalPromotions.email],
      smsBooking: [prefs.notifications.bookingConfirmations.sms],
      smsHost: [prefs.notifications.hostMessages.sms],
      whatsappBooking: [prefs.notifications.bookingConfirmations.whatsapp],
    });
  }

  /**
   * Handle dropdown selection changes
   */
  protected onLanguageChange(langVal: string): void {
    this.preferencesForm.get('language')?.setValue(langVal);
    this.preferencesForm.get('language')?.markAsDirty();
  }

  protected onCurrencyChange(currVal: string): void {
    this.preferencesForm.get('currency')?.setValue(currVal);
    this.preferencesForm.get('currency')?.markAsDirty();
  }

  /**
   * Save preferences to in-memory ProfileService
   */
  protected async onSubmit(): Promise<void> {
    if (this.preferencesForm.invalid) {
      this.errorNotice.set('Please select valid regional preferences.');
      return;
    }

    this.isSaving.set(true);
    this.successNotice.set(null);
    this.errorNotice.set(null);

    const values = this.preferencesForm.value;

    const updatedPreferences: PreferencesSettings = {
      language: values.language,
      currency: values.currency,
      notifications: {
        bookingConfirmations: {
          email: !!values.emailBooking,
          sms: !!values.smsBooking,
          whatsapp: !!values.whatsappBooking,
        },
        hostMessages: {
          email: !!values.emailHost,
          push: true,
          sms: !!values.smsHost,
        },
        culturalPromotions: {
          email: !!values.emailPromos,
          push: false,
        },
      },
    };

    const result = await this.profileService.updatePreferences(updatedPreferences);
    this.isSaving.set(false);

    if (result.success) {
      this.preferencesForm.markAsPristine();
      this.successNotice.set(
        'Demo Mode: Preferences updated in memory for this session. Language and currency selections are saved.'
      );
    } else {
      this.errorNotice.set(result.message);
    }
  }

  /**
   * Revert form changes to current state
   */
  protected onCancel(): void {
    this.initForm();
    this.successNotice.set(null);
    this.errorNotice.set(null);
  }

  /**
   * Dismiss feedback banners
   */
  protected dismissNotice(): void {
    this.successNotice.set(null);
    this.errorNotice.set(null);
  }
}
