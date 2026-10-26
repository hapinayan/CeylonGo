// =============================================================================
// CeylonGo — Module 07: Profile Service Unit Tests
// Architecture: Vitest + Angular Signals
// Security Policy: Zero storage persistence. In-memory mutations only.
// =============================================================================

import '@angular/compiler';
import { describe, it, expect, beforeEach } from 'vitest';
import { ProfileService } from './profile.service';

describe('ProfileService', () => {
  let service: ProfileService;

  beforeEach(() => {
    service = new ProfileService();
    service.resetToMockData();
  });

  it('should initialize with default mock profile in memory', () => {
    const profile = service.profile();
    expect(profile).toBeDefined();
    expect(profile.personal.firstName).toBe('Hapinayan');
    expect(profile.personal.lastName).toBe('S.');
    expect(profile.personal.email).toBe('traveler@ceylongo.com');
  });

  it('should compute full name, initials, and district label correctly', () => {
    expect(service.userFullName()).toBe('Hapinayan S.');
    expect(service.userInitials()).toBe('HS');
    expect(service.userDistrictLabel()).toContain('Colombo');
  });

  it('should update personal info in memory without localStorage', async () => {
    const updateResult = await service.updatePersonalInfo({
      firstName: 'Mithushika',
      lastName: 'Dev',
      phone: '+94 77 999 8888',
    });

    expect(updateResult.success).toBe(true);
    expect(service.userFullName()).toBe('Mithushika Dev');
    expect(service.userInitials()).toBe('MD');
    expect(service.profile().personal.phone).toBe('+94 77 999 8888');
  });

  it('should update preferences in memory', async () => {
    const updateResult = await service.updatePreferences({
      language: 'si',
      currency: 'USD',
    });

    expect(updateResult.success).toBe(true);
    expect(service.profile().preferences.language).toBe('si');
    expect(service.profile().preferences.currency).toBe('USD');
  });

  it('should update emergency contact in memory', async () => {
    const updateResult = await service.updateEmergencyContact({
      contactName: 'Kasun Perera',
      relationship: 'Sibling',
      phone: '+94 77 555 4444',
      dietaryPreferences: ['Vegan'],
    });

    expect(updateResult.success).toBe(true);
    expect(service.profile().emergency.contactName).toBe('Kasun Perera');
    expect(service.profile().emergency.relationship).toBe('Sibling');
    expect(service.profile().emergency.dietaryPreferences).toEqual(['Vegan']);
  });

  it('should simulate password change without storing passwords in memory', async () => {
    const result = await service.changePassword({
      currentPassword: 'OldPassword123!',
      newPassword: 'NewPassword@2026',
      confirmPassword: 'NewPassword@2026',
    });

    expect(result.success).toBe(true);
    expect(result.message).toContain('DEMO MODE');
    // Security verification: password is NOT stored anywhere in the profile entity
    const profileJson = JSON.stringify(service.profile());
    expect(profileJson).not.toContain('OldPassword123!');
    expect(profileJson).not.toContain('NewPassword@2026');
  });

  it('should toggle two-factor authentication simulation in memory', async () => {
    const initial2Fa = service.profile().security.twoFactorEnabled;
    const result = await service.toggleTwoFactor();

    expect(result.success).toBe(true);
    expect(service.profile().security.twoFactorEnabled).toBe(!initial2Fa);
  });

  it('should revoke active session in memory', async () => {
    const initialCount = service.activeSessionsCount();
    const result = await service.revokeSession('sess-02');

    expect(result.success).toBe(true);
    expect(service.activeSessionsCount()).toBe(initialCount - 1);
  });

  it('should reset back to initial mock profile on resetToMockData', async () => {
    await service.updatePersonalInfo({ firstName: 'Temporary' });
    expect(service.userFullName()).toBe('Temporary S.');

    service.resetToMockData();
    expect(service.userFullName()).toBe('Hapinayan S.');
  });
});
