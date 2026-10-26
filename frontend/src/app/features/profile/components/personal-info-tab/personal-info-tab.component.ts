// =============================================================================
// CeylonGo — Module 07: Personal Information Tab Component
// Architecture: Angular 21 Standalone + Reactive Forms + Signals
// =============================================================================

import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import {
  ButtonComponent,
  FormInputComponent,
  SelectComponent,
} from '../../../../shared/components';
import { ProfileService } from '../../services/profile.service';
import { SRI_LANKAN_DISTRICTS } from '../../models/profile.models';
import { phoneValidator } from '../../validators/phone.validator';

@Component({
  selector: 'app-personal-info-tab',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    FormInputComponent,
    SelectComponent,
  ],
  templateUrl: './personal-info-tab.component.html',
  styleUrl: './personal-info-tab.component.scss',
})
export class PersonalInfoTabComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  protected readonly profileService = inject(ProfileService);

  // Readonly reference to in-memory profile signal
  protected readonly profile = this.profileService.profile;

  // Official 25 Sri Lankan administrative districts
  protected readonly districtOptions = SRI_LANKAN_DISTRICTS;

  // Supported spoken language options
  protected readonly availableLanguages = [
    'English',
    'සිංහල (Sinhala)',
    'தமிழ் (Tamil)',
    'French',
    'German',
    'Russian',
    'Japanese',
    'Mandarin',
  ];

  // Local state signals
  protected readonly isSaving = signal<boolean>(false);
  protected readonly successNotice = signal<string | null>(null);
  protected readonly errorNotice = signal<string | null>(null);
  protected readonly selectedLanguages = signal<string[]>([]);
  protected readonly bioLength = signal<number>(0);

  // Reactive Form
  protected personalForm!: FormGroup;
  private bioSub?: Subscription;

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    this.bioSub?.unsubscribe();
  }

  /**
   * Initialize or reset the form values from in-memory ProfileService
   */
  protected initForm(): void {
    const personal = this.profile().personal;

    this.personalForm = this.fb.group({
      firstName: [
        personal.firstName,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      lastName: [
        personal.lastName,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      email: [{ value: personal.email, disabled: true }],
      phone: [personal.phone, [Validators.required, phoneValidator()]],
      district: [personal.district, [Validators.required]],
      bio: [personal.bio, [Validators.maxLength(300)]],
    });

    this.selectedLanguages.set([...personal.spokenLanguages]);
    this.bioLength.set(personal.bio ? personal.bio.length : 0);

    // Track bio character counter
    this.bioSub?.unsubscribe();
    this.bioSub = this.personalForm.get('bio')?.valueChanges.subscribe((val) => {
      this.bioLength.set(val ? String(val).length : 0);
    });
  }

  /**
   * Handle district change emitted from app-select
   */
  protected onDistrictChange(districtCode: string): void {
    this.personalForm.get('district')?.setValue(districtCode);
    this.personalForm.get('district')?.markAsDirty();
  }

  /**
   * Toggle spoken language tag
   */
  protected toggleLanguage(lang: string): void {
    const current = this.selectedLanguages();
    if (current.includes(lang)) {
      if (current.length > 1) {
        this.selectedLanguages.set(current.filter((l) => l !== lang));
        this.personalForm.markAsDirty();
      }
    } else {
      this.selectedLanguages.set([...current, lang]);
      this.personalForm.markAsDirty();
    }
  }

  /**
   * Validation helpers
   */
  protected isFieldInvalid(fieldName: string): boolean {
    const control = this.personalForm.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  protected getFieldError(fieldName: string): string | undefined {
    const control = this.personalForm.get(fieldName);
    if (!control || !control.errors || !(control.dirty || control.touched)) {
      return undefined;
    }

    if (control.errors['required']) {
      return 'This field is required.';
    }
    if (control.errors['minlength']) {
      const min = control.errors['minlength'].requiredLength;
      return `Must be at least ${min} characters.`;
    }
    if (control.errors['maxlength']) {
      const max = control.errors['maxlength'].requiredLength;
      return `Cannot exceed ${max} characters.`;
    }
    if (control.errors['invalidPhone']) {
      return control.errors['invalidPhone'].message;
    }

    return 'Invalid field value.';
  }

  /**
   * Submit form and update in-memory state
   */
  protected async onSubmit(): Promise<void> {
    if (this.personalForm.invalid) {
      this.personalForm.markAllAsTouched();
      this.errorNotice.set('Please correct the highlighted form errors before saving.');
      return;
    }

    this.isSaving.set(true);
    this.successNotice.set(null);
    this.errorNotice.set(null);

    const formValues = this.personalForm.getRawValue();

    const updatePayload = {
      firstName: formValues.firstName.trim(),
      lastName: formValues.lastName.trim(),
      phone: formValues.phone.trim(),
      district: formValues.district,
      bio: (formValues.bio || '').trim(),
      spokenLanguages: [...this.selectedLanguages()],
    };

    const result = await this.profileService.updatePersonalInfo(updatePayload);
    this.isSaving.set(false);

    if (result.success) {
      this.personalForm.markAsPristine();
      this.successNotice.set(
        'Demo Mode: Personal details updated in memory for this session. Changes are now visible in the profile header.'
      );
    } else {
      this.errorNotice.set(result.message);
    }
  }

  /**
   * Reset changes back to current in-memory profile state
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
