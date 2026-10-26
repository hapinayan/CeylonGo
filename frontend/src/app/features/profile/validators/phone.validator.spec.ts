// =============================================================================
// CeylonGo — Module 07: Phone Validator Unit Tests
// Architecture: Vitest + Angular Forms
// =============================================================================

import '@angular/compiler';
import { describe, it, expect } from 'vitest';
import { FormControl } from '@angular/forms';
import { phoneValidator } from './phone.validator';

describe('phoneValidator', () => {
  const validator = phoneValidator();

  it('should return null for empty or null values (letting Validators.required handle it)', () => {
    expect(validator(new FormControl(''))).toBeNull();
    expect(validator(new FormControl(null))).toBeNull();
    expect(validator(new FormControl(undefined))).toBeNull();
  });

  it('should accept valid Sri Lankan mobile numbers with local 0 prefix', () => {
    expect(validator(new FormControl('0771234567'))).toBeNull();
    expect(validator(new FormControl('0719876543'))).toBeNull();
    expect(validator(new FormControl('070 123 4567'))).toBeNull();
    expect(validator(new FormControl('072-345-6789'))).toBeNull();
  });

  it('should accept valid Sri Lankan mobile numbers with +94 country code', () => {
    expect(validator(new FormControl('+94771234567'))).toBeNull();
    expect(validator(new FormControl('+94 77 123 4567'))).toBeNull();
    expect(validator(new FormControl('+94 71 987 6543'))).toBeNull();
  });

  it('should accept valid international numbers in E.164 format', () => {
    expect(validator(new FormControl('+12025550123'))).toBeNull();
    expect(validator(new FormControl('+44 7911 123456'))).toBeNull();
    expect(validator(new FormControl('+61 412 345 678'))).toBeNull();
    expect(validator(new FormControl('+81 90 1234 5678'))).toBeNull();
  });

  it('should reject invalid Sri Lankan operator codes or invalid lengths', () => {
    // 079 is not an assigned mobile operator code in Sri Lanka
    expect(validator(new FormControl('0791234567'))).toEqual({
      invalidPhone: {
        message:
          'Please enter a valid Sri Lankan mobile (+94 77 123 4567 or 0771234567) or international number (+12025550123).',
      },
    });

    // Too short (8 digits)
    expect(validator(new FormControl('07712345'))).not.toBeNull();

    // Random non-phone strings
    expect(validator(new FormControl('not-a-phone'))).not.toBeNull();
    expect(validator(new FormControl('12345'))).not.toBeNull();
  });
});
