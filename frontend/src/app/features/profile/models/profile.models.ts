// =============================================================================
// CeylonGo — Module 07: User Profile & Account Settings Models
// Architecture: Angular 21 Standalone + TypeScript
// Target Backend: Microsoft SQL Server (MSSQL) via FastAPI Service
// Security Policy: In-Memory State Only. No sensitive data in localStorage.
// =============================================================================

import { SelectOption } from '../../../shared/models/ui.models';

/**
 * Top-level profile section tab identifiers
 */
export type ProfileTabId = 'personal' | 'security' | 'preferences' | 'emergency';

/**
 * Navigation tab model for profile shell
 */
export interface ProfileTab {
  readonly id: ProfileTabId;
  readonly label: string;
  readonly icon: string;
  readonly badge?: string;
  readonly description?: string;
}

/**
 * Verification status for user profile.
 * NOTE: Fictional demo users must never be claimed as officially verified.
 */
export type ProfileVerificationStatus =
  | 'unverified'
  | 'demo_verified'
  | 'pending_id_verification';

/**
 * Personal contact and biographical information
 */
export interface PersonalInformation {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  district: string;
  nationality: string;
  spokenLanguages: string[];
  avatarUrl: string;
  memberSince: string;
  verificationStatus: ProfileVerificationStatus;
  verificationLabel: string;
}

/**
 * Security credentials & session model (Client-side simulation)
 * Passwords and real auth tokens are NEVER persisted or stored.
 */
export interface SecuritySettings {
  twoFactorEnabled: boolean;
  twoFactorMethod: 'sms' | 'authenticator';
  lastPasswordChangeDate: string;
  isDemoMode: boolean;
  activeSessions: ActiveSession[];
}

/**
 * Active login session item
 */
export interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  location: string;
  ipAddress: string;
  lastActive: string;
  isCurrent: boolean;
}

/**
 * Regional preferences and notification channels
 */
export interface PreferencesSettings {
  language: 'en' | 'si' | 'ta';
  currency: 'LKR' | 'USD' | 'EUR' | 'GBP';
  notifications: NotificationPreferences;
}

/**
 * Multi-channel notification delivery settings
 */
export interface NotificationPreferences {
  bookingConfirmations: {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
  };
  hostMessages: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  culturalPromotions: {
    email: boolean;
    push: boolean;
  };
}

/**
 * Emergency contact and general homestay host assistance notes.
 * NOTE: Real emergency contacts and sensitive medical records are strictly prohibited.
 */
export interface EmergencyContact {
  contactName: string;
  relationship: string;
  phone: string;
  dietaryPreferences: string[];
  accessibilityNotes: string;
}

/**
 * Aggregated user profile entity mapping to future MSSQL tables:
 * - [dbo].[Users]
 * - [dbo].[UserProfiles]
 * - [dbo].[UserPreferences]
 * - [dbo].[EmergencyContacts]
 */
export interface UserProfile {
  id: string;
  personal: PersonalInformation;
  security: SecuritySettings;
  preferences: PreferencesSettings;
  emergency: EmergencyContact;
}

/**
 * Payload interface for simulated password change request.
 * Controls are strictly transient and wiped from memory after validation.
 */
export interface PasswordChangePayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Result feedback message from ProfileService operations
 */
export interface ProfileOperationResult {
  success: boolean;
  message: string;
  isDemoNotice?: boolean;
}

/**
 * Official 25 Administrative Districts of Sri Lanka (organized by province).
 * Tourism destinations (e.g. Ella, Sigiriya, Mirissa) belong to their respective districts.
 */
export const SRI_LANKAN_DISTRICTS: SelectOption<string>[] = [
  // Western Province
  { label: 'Colombo (Western Province)', value: 'colombo' },
  { label: 'Gampaha (Western Province)', value: 'gampaha' },
  { label: 'Kalutara (Western Province)', value: 'kalutara' },

  // Central Province
  { label: 'Kandy (Central Province)', value: 'kandy' },
  { label: 'Matale [Sigiriya / Dambulla] (Central Province)', value: 'matale' },
  { label: 'Nuwara Eliya (Central Province)', value: 'nuwara-eliya' },

  // Southern Province
  { label: 'Galle (Southern Province)', value: 'galle' },
  { label: 'Matara [Mirissa / Weligama] (Southern Province)', value: 'matara' },
  { label: 'Hambantota [Yala / Tangalle] (Southern Province)', value: 'hambantota' },

  // Northern Province
  { label: 'Jaffna (Northern Province)', value: 'jaffna' },
  { label: 'Kilinochchi (Northern Province)', value: 'kilinochchi' },
  { label: 'Mannar (Northern Province)', value: 'mannar' },
  { label: 'Vavuniya (Northern Province)', value: 'vavuniya' },
  { label: 'Mullaitivu (Northern Province)', value: 'mullaitivu' },

  // Eastern Province
  { label: 'Trincomalee (Eastern Province)', value: 'trincomalee' },
  { label: 'Batticaloa (Eastern Province)', value: 'batticaloa' },
  { label: 'Ampara (Eastern Province)', value: 'ampara' },

  // North Western Province
  { label: 'Kurunegala (North Western Province)', value: 'kurunegala' },
  { label: 'Puttalam [Kalpitiya] (North Western Province)', value: 'puttalam' },

  // North Central Province
  { label: 'Anuradhapura (North Central Province)', value: 'anuradhapura' },
  { label: 'Polonnaruwa (North Central Province)', value: 'polonnaruwa' },

  // Uva Province
  { label: 'Badulla [Ella / Bandarawela] (Uva Province)', value: 'badulla' },
  { label: 'Monaragala (Uva Province)', value: 'monaragala' },

  // Sabaragamuwa Province
  { label: 'Ratnapura (Sabaragamuwa Province)', value: 'ratnapura' },
  { label: 'Kegalle (Sabaragamuwa Province)', value: 'kegalle' },
];

/**
 * Predefined supported language options
 */
export const LANGUAGE_OPTIONS: SelectOption<'en' | 'si' | 'ta'>[] = [
  { label: 'English (US / UK)', value: 'en', icon: '🌐' },
  { label: 'සිංහල (Sinhala)', value: 'si', icon: '🇱🇰' },
  { label: 'தமிழ் (Tamil)', value: 'ta', icon: '🇱🇰' },
];

/**
 * Predefined supported currency options
 */
export const CURRENCY_OPTIONS: SelectOption<'LKR' | 'USD' | 'EUR' | 'GBP'>[] = [
  { label: 'LKR (Rs) — Sri Lankan Rupee', value: 'LKR', icon: 'රු' },
  { label: 'USD ($) — US Dollar', value: 'USD', icon: '$' },
  { label: 'EUR (€) — Euro', value: 'EUR', icon: '€' },
  { label: 'GBP (£) — British Pound', value: 'GBP', icon: '£' },
];

/**
 * Common dietary preference options for rural homestay hosts
 */
export const DIETARY_OPTIONS = [
  'Strict Vegetarian',
  'Vegan',
  'Halal Friendly',
  'No Seafood',
  'Gluten Free',
  'No Restrictions',
] as const;
