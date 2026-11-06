// =============================================================================
// CeylonGo — Module 07: Emergency & Travel Tab Component
// Architecture: Angular 21 Standalone + Reactive Forms + Signals
// Security Policy: Zero storage persistence. In-memory demo data only.
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
  SelectComponent,
} from '../../../../shared/components';
import { ProfileService } from '../../services/profile.service';
import { SelectOption } from '../../../../shared/models/ui.models';
import { DIETARY_OPTIONS } from '../../models/profile.models';
import { phoneValidator } from '../../validators/phone.validator';

@Component({
  selector: 'app-emergency-contact-tab',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    FormInputComponent,
    SelectComponent,
  ],
  templateUrl: './emergency-contact-tab.component.html',
  styleUrl: './emergency-contact-tab.component.scss',
})
export class EmergencyContactTabComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  protected readonly profileService = inject(ProfileService);

  // In-memory profile state from ProfileService
  protected readonly profile = this.profileService.profile;

  // Options
  protected readonly dietaryOptions = DIETARY_OPTIONS;

  protected readonly relationshipOptions: SelectOption<string>[] = [
    { label: 'Friend', value: 'Friend' },
    { label: 'Parent', value: 'Parent' },
    { label: 'Spouse / Partner', value: 'Spouse / Partner' },
    { label: 'Sibling', value: 'Sibling' },
    { label: 'Child', value: 'Child' },
    { label: 'Relative', value: 'Relative' },
    { label: 'Colleague', value: 'Colleague' },
    { label: 'Other', value: 'Other' },
  ];

  // Local state signals
  protected readonly isSaving = signal<boolean>(false);
  protected readonly successNotice = signal<string | null>(null);
  protected readonly errorNotice = signal<string | null>(null);
  protected readonly selectedDiets = signal<string[]>([]);

  // Reactive Form
  protected emergencyForm!: FormGroup;

  ngOnInit(): void {
    this.initForm();
  }

  protected initForm(): void {
    const emergency = this.profile().emergency;

    this.emergencyForm = this.fb.group({
      contactName: [
        emergency.contactName,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(60),
        ],
      ],
      relationship: [emergency.relationship, [Validators.required]],
      phone: [emergency.phone, [Validators.required, phoneValidator()]],
      accessibilityNotes: [
        emergency.accessibilityNotes,
        [Validators.maxLength(300)],
      ],
    });

    this.selectedDiets.set([...emergency.dietaryPreferences]);
  }

  protected onRelationshipChange(relVal: string): void {
    this.emergencyForm.get('relationship')?.setValue(relVal);
    this.emergencyForm.get('relationship')?.markAsDirty();
  }

  protected toggleDiet(diet: string): void {
    const current = this.selectedDiets();
    if (current.includes(diet)) {
      this.selectedDiets.set(current.filter((d) => d !== diet));
    } else {
      this.selectedDiets.set([...current, diet]);
    }
    this.emergencyForm.markAsDirty();
  }

  /**
   * Field validation helper
   */
  protected isFieldInvalid(fieldName: string): boolean {
    const control = this.emergencyForm.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  protected getFieldError(fieldName: string): string | undefined {
    const control = this.emergencyForm.get(fieldName);
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
   * Save emergency contact and stay preferences
   */
  protected async onSubmit(): Promise<void> {
    if (this.emergencyForm.invalid) {
      this.emergencyForm.markAllAsTouched();
      this.errorNotice.set('Please fix the highlighted errors before saving.');
      return;
    }

    this.isSaving.set(true);
    this.successNotice.set(null);
    this.errorNotice.set(null);

    const values = this.emergencyForm.getRawValue();

    const updatePayload = {
      contactName: values.contactName.trim(),
      relationship: values.relationship,
      phone: values.phone.trim(),
      dietaryPreferences: [...this.selectedDiets()],
      accessibilityNotes: (values.accessibilityNotes || '').trim(),
    };

    const result = await this.profileService.updateEmergencyContact(updatePayload);
    this.isSaving.set(false);

    if (result.success) {
      this.emergencyForm.markAsPristine();
      this.successNotice.set(
        'DEMO MODE: Emergency and travel assistance preferences updated in memory for this session.'
      );
    } else {
      this.errorNotice.set(result.message);
    }
  }

  protected onCancel(): void {
    this.initForm();
    this.successNotice.set(null);
    this.errorNotice.set(null);
  }

  protected dismissNotice(): void {
    this.successNotice.set(null);
    this.errorNotice.set(null);
  }
}
