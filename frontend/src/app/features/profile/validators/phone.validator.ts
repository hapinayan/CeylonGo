// =============================================================================
// CeylonGo — Module 07: Phone Number Validator
// Validates Sri Lankan mobile (+94 7X / 07X) and international E.164 numbers.
// =============================================================================

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validates that an input is either a valid Sri Lankan mobile number
 * or a valid international phone number following ITU-T E.164.
 *
 * Sri Lankan Mobile Criteria:
 * - Begins with local '0' or international '+94'
 * - Followed by valid mobile operator code: 70, 71, 72, 74, 75, 76, 77, 78
 * - Followed by exactly 7 subscriber digits
 *
 * International Criteria:
 * - Begins with '+'
 * - Followed by 1-3 digit country code and 6-14 subscriber digits (total 7-15 digits)
 */
export function phoneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const rawValue = control.value;
    if (rawValue === null || rawValue === undefined || rawValue === '') {
      return null; // Empty input handled by Validators.required if mandatory
    }

    // Strip whitespaces, hyphens, periods, and parentheses
    const sanitized = String(rawValue).trim().replace(/[\s\-().]/g, '');

    const isSriLankanMobile = /^(?:0|\+94)7[01245678]\d{7}$/.test(sanitized);
    const isInternationalE164 = /^\+[1-9]\d{6,14}$/.test(sanitized);

    if (isSriLankanMobile || isInternationalE164) {
      return null;
    }

    return {
      invalidPhone: {
        message:
          'Please enter a valid Sri Lankan mobile (+94 77 123 4567 or 0771234567) or international number (+12025550123).',
      },
    };
  };
}
