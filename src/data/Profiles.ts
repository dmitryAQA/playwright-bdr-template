import { UserProfile } from '../types/BusinessEntities';

/**
 * Predefined User Profiles for domain-specific testing (e.g., hybrid API tests).
 */
export const PROFILES = {
    PREMIUM: {
        username: 'premium_user',
        balance: '$1,000.00',
        status: 'Active',
        region: 'EU-West',
    },
    BASIC: {
        username: 'standard_user',
        balance: '$0.00',
        status: 'Active',
        region: 'US-East',
    },
    DMITRY: {
        username: 'dmitry_sorvachev',
        balance: '$5,000.00',
        status: 'Active',
        region: 'RU-Moscow',
    },
} as const;

export type ProfileKey = keyof typeof PROFILES;
