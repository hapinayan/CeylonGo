import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validates that two password fields within a FormGroup match.
 * Sets 'passwordMismatch' error directly on the confirm control for inline feedback,
 * and returns { passwordMismatch: true } on the form group if unequal.
 */
export function passwordMatchValidator(
  passwordControlName: string = 'password',
  confirmControlName: string = 'confirmPassword'
): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const password = group.get(passwordControlName);
    const confirm = group.get(confirmControlName);

    if (!password || !confirm) {
      return null;
    }

    // Only validate if confirm control has a value or is dirty
    if (confirm.value && password.value !== confirm.value) {
      const currentErrors = confirm.errors || {};
      confirm.setErrors({ ...currentErrors, passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      // If error was previously passwordMismatch, clear it without wiping other errors (like required)
      if (confirm.errors && confirm.errors['passwordMismatch']) {
        const { passwordMismatch, ...remainingErrors } = confirm.errors;
        confirm.setErrors(Object.keys(remainingErrors).length ? remainingErrors : null);
      }
      return null;
    }
  };
}
