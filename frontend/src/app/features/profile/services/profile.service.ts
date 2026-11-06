// =============================================================================
// CeylonGo — Module 07: Profile State & Business Logic Service
// Architecture: Angular 21 Standalone + Modern Reactive Signals
// Target Enterprise Architecture: FastAPI Service + Microsoft SQL Server (MSSQL)
// Security Policy: Strictly In-Memory. Zero localStorage/sessionStorage usage.
// =============================================================================

import { Injectable, signal, computed } from '@angular/core';
import {
  UserProfile,
  PersonalInformation,
  SecuritySettings,
  PreferencesSettings,
  EmergencyContact,
  PasswordChangePayload,
  ProfileOperationResult,
  SRI_LANKAN_DISTRICTS,
} from '../models/profile.models';
import { MOCK_USER_PROFILE } from '../data/profile-mock-data';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  // ---------------------------------------------------------------------------
  // Reactive In-Memory State Signals (Zero browser storage persistence)
  // ---------------------------------------------------------------------------

  private readonly _profile = signal<UserProfile>(structuredClone(MOCK_USER_PROFILE));
  readonly profile = this._profile.asReadonly();

  private readonly _isLoading = signal<boolean>(false);
  readonly isLoading = this._isLoading.asReadonly();

  private readonly _isSaving = signal<boolean>(false);
  readonly isSaving = this._isSaving.asReadonly();

  private readonly _lastMessage = signal<ProfileOperationResult | null>(null);
  readonly lastMessage = this._lastMessage.asReadonly();

  // ---------------------------------------------------------------------------
  // Computed Readonly Selectors
  // ---------------------------------------------------------------------------

  /**
   * Computed full name of the user
   */
  readonly userFullName = computed(() => {
    const personal = this._profile().personal;
    return `${personal.firstName} ${personal.lastName}`.trim();
  });

  /**
   * Computed 1-2 character initials for the avatar fallback
   */
  readonly userInitials = computed(() => {
    const personal = this._profile().personal;
    const firstInitial = personal.firstName?.charAt(0) || '';
    const lastInitial = personal.lastName?.replace('.', '').charAt(0) || '';
    return (firstInitial + lastInitial).toUpperCase() || 'CG';
  });

  /**
   * Formatted district name resolved from the official 25 administrative districts
   */
  readonly userDistrictLabel = computed(() => {
    const districtVal = this._profile().personal.district;
    const match = SRI_LANKAN_DISTRICTS.find((d) => d.value === districtVal);
    return match ? match.label : districtVal;
  });

  /**
   * Flag indicating whether current operations are running in client-side demonstration mode
   */
  readonly isDemoMode = computed(() => true);

  /**
   * Number of active sessions
   */
  readonly activeSessionsCount = computed(() => {
    return this._profile().security.activeSessions.length;
  });

  // ---------------------------------------------------------------------------
  // Profile Mutation Methods (In-Memory Simulation -> Future FastAPI / MSSQL)
  // ---------------------------------------------------------------------------

  /**
   * Retrieve current user profile snapshot.
   * Future Backend Hook: GET /api/v1/profile -> FastAPI -> MSSQL [dbo].[Users] & [dbo].[UserProfiles]
   */
  getProfile(): UserProfile {
    return structuredClone(this._profile());
  }

  /**
   * Update personal details in memory.
   * Future Backend Hook: PUT /api/v1/profile/personal -> FastAPI -> MSSQL [dbo].[UserProfiles]
   */
  async updatePersonalInfo(data: Partial<PersonalInformation>): Promise<ProfileOperationResult> {
    this._isSaving.set(true);
    this._lastMessage.set(null);

    // Simulate async network latency (400ms)
    await this.simulateLatency(400);

    try {
      this._profile.update((current) => ({
        ...current,
        personal: {
          ...current.personal,
          ...data,
        },
      }));

      const result: ProfileOperationResult = {
        success: true,
        message: 'Personal details updated successfully in demo session.',
        isDemoNotice: true,
      };

      this._lastMessage.set(result);
      return result;
    } catch {
      const errorResult: ProfileOperationResult = {
        success: false,
        message: 'Failed to update personal details.',
      };
      this._lastMessage.set(errorResult);
      return errorResult;
    } finally {
      this._isSaving.set(false);
    }
  }

  /**
   * Update user localization and notification preferences in memory.
   * Future Backend Hook: PUT /api/v1/profile/preferences -> FastAPI -> MSSQL [dbo].[UserPreferences]
   */
  async updatePreferences(data: Partial<PreferencesSettings>): Promise<ProfileOperationResult> {
    this._isSaving.set(true);
    this._lastMessage.set(null);

    await this.simulateLatency(350);

    try {
      this._profile.update((current) => ({
        ...current,
        preferences: {
          ...current.preferences,
          ...data,
        },
      }));

      const result: ProfileOperationResult = {
        success: true,
        message: 'Preferences updated successfully in demo session.',
        isDemoNotice: true,
      };

      this._lastMessage.set(result);
      return result;
    } catch {
      const errorResult: ProfileOperationResult = {
        success: false,
        message: 'Failed to update preferences.',
      };
      this._lastMessage.set(errorResult);
      return errorResult;
    } finally {
      this._isSaving.set(false);
    }
  }

  /**
   * Update emergency contact & homestay stay notes in memory.
   * Future Backend Hook: PUT /api/v1/profile/emergency -> FastAPI -> MSSQL [dbo].[EmergencyContacts]
   * SECURITY RULE: Never written to localStorage or sessionStorage.
   */
  async updateEmergencyContact(data: Partial<EmergencyContact>): Promise<ProfileOperationResult> {
    this._isSaving.set(true);
    this._lastMessage.set(null);

    await this.simulateLatency(350);

    try {
      this._profile.update((current) => ({
        ...current,
        emergency: {
          ...current.emergency,
          ...data,
        },
      }));

      const result: ProfileOperationResult = {
        success: true,
        message: 'Emergency and host assistance details updated in memory for this session.',
        isDemoNotice: true,
      };

      this._lastMessage.set(result);
      return result;
    } catch {
      const errorResult: ProfileOperationResult = {
        success: false,
        message: 'Failed to update emergency contact details.',
      };
      this._lastMessage.set(errorResult);
      return errorResult;
    } finally {
      this._isSaving.set(false);
    }
  }

  /**
   * Simulated Password Change Demonstration.
   * Future Backend Hook: POST /api/v1/auth/change-password -> FastAPI -> BCrypt verification -> MSSQL
   * SECURITY RULE: Passwords are NEVER saved in state or memory.
   */
  async changePassword(payload: PasswordChangePayload): Promise<ProfileOperationResult> {
    this._isSaving.set(true);
    this._lastMessage.set(null);

    await this.simulateLatency(500);

    // Validate payload presence client-side
    if (!payload.currentPassword || !payload.newPassword || !payload.confirmPassword) {
      this._isSaving.set(false);
      const err: ProfileOperationResult = {
        success: false,
        message: 'All password fields are required.',
      };
      this._lastMessage.set(err);
      return err;
    }

    if (payload.newPassword !== payload.confirmPassword) {
      this._isSaving.set(false);
      const err: ProfileOperationResult = {
        success: false,
        message: 'New passwords do not match.',
      };
      this._lastMessage.set(err);
      return err;
    }

    // Update in-memory last change timestamp (without storing passwords)
    const todayIso = new Date().toISOString().split('T')[0];
    this._profile.update((current) => ({
      ...current,
      security: {
        ...current.security,
        lastPasswordChangeDate: todayIso,
      },
    }));

    this._isSaving.set(false);

    const result: ProfileOperationResult = {
      success: true,
      message: 'DEMO MODE: Password validation succeeded client-side. No changes were committed to MSSQL database.',
      isDemoNotice: true,
    };
    this._lastMessage.set(result);
    return result;
  }

  /**
   * Simulated Two-Factor Authentication Toggle Demonstration.
   * Future Backend Hook: POST /api/v1/auth/2fa/toggle -> FastAPI -> Sri Lankan SMS Gateway / TOTP
   */
  async toggleTwoFactor(): Promise<ProfileOperationResult> {
    this._isSaving.set(true);
    this._lastMessage.set(null);

    await this.simulateLatency(350);

    const nextState = !this._profile().security.twoFactorEnabled;

    this._profile.update((current) => ({
      ...current,
      security: {
        ...current.security,
        twoFactorEnabled: nextState,
      },
    }));

    this._isSaving.set(false);

    const result: ProfileOperationResult = {
      success: true,
      message: `DEMO MODE: Two-factor authentication simulated as ${nextState ? 'enabled' : 'disabled'}. Real SMS / Authenticator integration will connect to MSSQL backend.`,
      isDemoNotice: true,
    };
    this._lastMessage.set(result);
    return result;
  }

  /**
   * Revoke an active session demonstration.
   * Future Backend Hook: DELETE /api/v1/auth/sessions/{id} -> FastAPI -> Redis / MSSQL session table
   */
  async revokeSession(sessionId: string): Promise<ProfileOperationResult> {
    this._isSaving.set(true);
    await this.simulateLatency(300);

    this._profile.update((current) => ({
      ...current,
      security: {
        ...current.security,
        activeSessions: current.security.activeSessions.filter((s) => s.id !== sessionId),
      },
    }));

    this._isSaving.set(false);

    const result: ProfileOperationResult = {
      success: true,
      message: 'DEMO MODE: Session removed from active list.',
      isDemoNotice: true,
    };
    this._lastMessage.set(result);
    return result;
  }

  /**
   * Upload user avatar using client-side in-memory FileReader preview.
   * Future Backend Hook: POST /api/v1/profile/avatar -> FastAPI multipart -> Cloud Storage -> MSSQL AvatarUrl
   */
  uploadAvatar(file: File): Promise<ProfileOperationResult & { avatarUrl?: string }> {
    return new Promise((resolve) => {
      this._isSaving.set(true);

      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;

        this._profile.update((current) => ({
          ...current,
          personal: {
            ...current.personal,
            avatarUrl: dataUrl,
          },
        }));

        this._isSaving.set(false);

        const result: ProfileOperationResult & { avatarUrl: string } = {
          success: true,
          avatarUrl: dataUrl,
          message: 'DEMO MODE: Avatar updated in memory for this session.',
          isDemoNotice: true,
        };
        this._lastMessage.set(result);
        resolve(result);
      };

      reader.onerror = () => {
        this._isSaving.set(false);
        const err: ProfileOperationResult = {
          success: false,
          message: 'Failed to read image file.',
        };
        this._lastMessage.set(err);
        resolve(err);
      };

      reader.readAsDataURL(file);
    });
  }

  /**
   * Simulated Account Deactivation demonstration.
   * Future Backend Hook: POST /api/v1/profile/deactivate -> FastAPI -> MSSQL [IsActive] = 0
   */
  async deactivateAccount(): Promise<ProfileOperationResult> {
    this._isSaving.set(true);
    await this.simulateLatency(500);
    this._isSaving.set(false);

    const result: ProfileOperationResult = {
      success: true,
      message: 'DEMO MODE: Account deactivation simulated. No database records were affected.',
      isDemoNotice: true,
    };
    this._lastMessage.set(result);
    return result;
  }

  /**
   * Simulated Account Deletion demonstration.
   * Future Backend Hook: DELETE /api/v1/profile -> FastAPI -> MSSQL soft/hard delete cascade
   */
  async deleteAccount(): Promise<ProfileOperationResult> {
    this._isSaving.set(true);
    await this.simulateLatency(500);

    // Reset in-memory state to clean initial clone
    this.resetToMockData();
    this._isSaving.set(false);

    const result: ProfileOperationResult = {
      success: true,
      message: 'DEMO MODE: Account deletion simulated. In-memory session has been reset.',
      isDemoNotice: true,
    };
    this._lastMessage.set(result);
    return result;
  }

  /**
   * Clear current banner / notification message
   */
  clearMessage(): void {
    this._lastMessage.set(null);
  }

  /**
   * Reset in-memory state back to original mock profile
   */
  resetToMockData(): void {
    this._profile.set(structuredClone(MOCK_USER_PROFILE));
    this._lastMessage.set(null);
  }

  // ---------------------------------------------------------------------------
  // Helper Utilities
  // ---------------------------------------------------------------------------

  private simulateLatency(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
