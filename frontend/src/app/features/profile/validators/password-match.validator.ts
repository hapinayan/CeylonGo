// =============================================================================
// CeylonGo — Module 07: Password Match Validator
// Validates that newPassword and confirmPassword match within a FormGroup.
// =============================================================================

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validates that two password controls in a form group have identical values.
 * Sets the 'passwordMismatch' error on the confirm control for direct inline error display.
 */
export function passwordMatchValidator(
  passwordControlName: string = 'newPassword',
  confirmControlName: string = 'confirmPassword'
): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const password = group.get(passwordControlName);
    const confirm = group.get(confirmControlName);

    if (!password || !confirm) {
      return null;
    }

    if (confirm.value && password.value !== confirm.value) {
      const currentErrors = confirm.errors || {};
      confirm.setErrors({ ...currentErrors, passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      if (confirm.errors && confirm.errors['passwordMismatch']) {
        const { passwordMismatch, ...remainingErrors } = confirm.errors;
        confirm.setErrors(Object.keys(remainingErrors).length ? remainingErrors : null);
      }
      return null;
    }
  };
}
