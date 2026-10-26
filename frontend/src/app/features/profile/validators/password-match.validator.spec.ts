// =============================================================================
// CeylonGo — Module 07: Password Match Validator Unit Tests
// Architecture: Vitest + Angular Forms
// =============================================================================

import '@angular/compiler';
import { describe, it, expect } from 'vitest';
import { FormControl, FormGroup } from '@angular/forms';
import { passwordMatchValidator } from './password-match.validator';

describe('passwordMatchValidator', () => {
  it('should return null when passwords match', () => {
    const group = new FormGroup(
      {
        newPassword: new FormControl('CeylonGo@2026'),
        confirmPassword: new FormControl('CeylonGo@2026'),
      },
      { validators: passwordMatchValidator('newPassword', 'confirmPassword') }
    );

    expect(group.valid).toBe(true);
    expect(group.errors).toBeNull();
    expect(group.get('confirmPassword')?.errors).toBeNull();
  });

  it('should return passwordMismatch error when passwords differ', () => {
    const group = new FormGroup(
      {
        newPassword: new FormControl('CeylonGo@2026'),
        confirmPassword: new FormControl('DifferentPassword123!'),
      },
      { validators: passwordMatchValidator('newPassword', 'confirmPassword') }
    );

    expect(group.valid).toBe(false);
    expect(group.errors).toEqual({ passwordMismatch: true });
    expect(group.get('confirmPassword')?.hasError('passwordMismatch')).toBe(true);
  });

  it('should clear passwordMismatch error when passwords are made identical', () => {
    const group = new FormGroup(
      {
        newPassword: new FormControl('CeylonGo@2026'),
        confirmPassword: new FormControl('Mismatched'),
      },
      { validators: passwordMatchValidator('newPassword', 'confirmPassword') }
    );

    expect(group.errors).toEqual({ passwordMismatch: true });

    group.get('confirmPassword')?.setValue('CeylonGo@2026');
    group.updateValueAndValidity();

    expect(group.errors).toBeNull();
    expect(group.get('confirmPassword')?.errors).toBeNull();
  });
});
