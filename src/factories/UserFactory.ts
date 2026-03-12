import { User } from '../types/BusinessEntities';

/**
 * UserFactory (Rule #4: Data-Driven Determinism)
 * 
 * Factory for creating test user data. Use overrides for fields 
 * that are critical to the test logic, and let Faker handle the rest.
 */
export class UserFactory {
    /**
     * Creates a standard user with deterministic random values
     */
    static createStandardUser(overrides: Partial<User> = {}, f: any): User {
        if (!f) throw new Error('Faker instance must be provided to Factory. Use the "faker" fixture in tests.');
        return {
            username: f.internet.username(),
            role: 'user',
            email: f.internet.email(),
            // Rule #8: Data Cleanup Tag
            _cleanup: true,
            ...overrides
        };
    }

    /**
     * Creates an admin user
     */
    static createAdminUser(overrides: Partial<User> = {}, f: any): User {
        if (!f) throw new Error('Faker instance must be provided to Factory. Use the "faker" fixture in tests.');
        return {
            username: f.internet.username(),
            role: 'admin',
            email: f.internet.email(),
            _cleanup: true,
            ...overrides
        };
    }

    /**
     * BDR Collection Factory
     * Returns an array of users for Data-Driven testing
     */
    static createUsers(count: number = 3, f: any, overrides: Partial<User> = {}): User[] {
        return Array.from({ length: count }, () => this.createStandardUser(overrides, f));
    }
}
