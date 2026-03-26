import { UserProfile } from '../types/BusinessEntities';
import { PROFILES, ProfileKey } from '../data/Profiles';

/**
 * ProfileFactory: Manages creation of domain-specific user state objects.
 */
export class ProfileFactory {
    /**
     * Creates a profile from the predefined PROFILES constant.
     */
    static createFromProfiles(key: ProfileKey, overrides: Partial<UserProfile> = {}): UserProfile {
        return {
            ...PROFILES[key],
            ...overrides,
        };
    }

    /**
     * Creates a randomized profile for general testing.
     */
    static createRandomProfile(f: any, overrides: Partial<UserProfile> = {}): UserProfile {
        if (!f) throw new Error('Faker instance must be provided.');
        return {
            username: f.internet.username(),
            balance: `$${f.finance.amount()}`,
            status: 'Active',
            region: f.location.countryCode(),
            ...overrides,
        };
    }
}
