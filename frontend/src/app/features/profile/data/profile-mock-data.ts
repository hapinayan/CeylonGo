// =============================================================================
// CeylonGo — Module 07: User Profile Mock Data Fixture
// Purely fictional demo profile for client-side prototype.
// NOTE: Contains zero real personal data, passwords, or authentication tokens.
// State is held strictly in memory and will connect to Microsoft SQL Server
// via FastAPI REST endpoints in future releases.
// =============================================================================

import { UserProfile } from '../models/profile.models';

/**
 * Fictional default demo traveler profile.
 * Aligns with the default authenticated state rendered in NavbarComponent ('Hapinayan S.').
 */
export const MOCK_USER_PROFILE: UserProfile = {
  id: 'demo-traveler-001',
  personal: {
    firstName: 'Hapinayan',
    lastName: 'S.',
    email: 'traveler@ceylongo.com',
    phone: '+94 77 123 4567',
    bio: 'Fictional demo traveler and heritage enthusiast exploring family homestays and tea estate retreats across Sri Lanka.',
    district: 'colombo',
    nationality: 'Sri Lankan',
    spokenLanguages: ['English', 'සිංහල (Sinhala)'],
    avatarUrl: 'assets/branding/ceylongo-logo.png',
    memberSince: 'October 2026',
    verificationStatus: 'demo_verified',
    verificationLabel: 'Demo Profile (Simulated)',
  },
  security: {
    twoFactorEnabled: false,
    twoFactorMethod: 'sms',
    lastPasswordChangeDate: '2026-10-15',
    isDemoMode: true,
    activeSessions: [
      {
        id: 'sess-01',
        device: 'MacBook Pro (Demo)',
        browser: 'Chrome 130',
        location: 'Colombo, Western Province',
        ipAddress: '192.168.1.1 (Simulated)',
        lastActive: 'Active right now',
        isCurrent: true,
      },
      {
        id: 'sess-02',
        device: 'iPhone 15 (Demo)',
        browser: 'Mobile Safari',
        location: 'Kandy, Central Province',
        ipAddress: '10.0.0.1 (Simulated)',
        lastActive: '2 days ago',
        isCurrent: false,
      },
    ],
  },
  preferences: {
    language: 'en',
    currency: 'LKR',
    notifications: {
      bookingConfirmations: {
        email: true,
        sms: true,
        whatsapp: false,
      },
      hostMessages: {
        email: true,
        push: true,
        sms: false,
      },
      culturalPromotions: {
        email: false,
        push: false,
      },
    },
  },
  emergency: {
    contactName: 'Nimal Silva (Fictional Demo Contact)',
    relationship: 'Friend (Demo)',
    phone: '+94 71 987 6543',
    dietaryPreferences: ['Strict Vegetarian', 'No Seafood'],
    accessibilityNotes: 'Demo preference: Prefers ground floor accommodation where available.',
  },
};
