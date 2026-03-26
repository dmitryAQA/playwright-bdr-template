import { User, UserRole } from '../types/BusinessEntities';
import { SYSTEM_USERS, SystemUserKey } from '../data/SystemUsers';
import { TestConfig } from '../config/TestConfig';

/**
 * UserFactory (Rule #4: Data-Driven Determinism)
 *
 * Factory for creating test user data. Consistent with BDR Manifesto.
 */
export class UserFactory {
    /**
     * Core helper for building user objects
     */
    private static assemble(role: UserRole, f: any, overrides: Partial<User> = {}): User {
        if (!f) throw new Error('Faker instance must be provided. Use the "faker" fixture.');
        return {
            username: f.internet.username(),
            password: TestConfig.password,
            role: role,
            email: f.internet.email(),
            _cleanup: true,
            ...overrides,
        };
    }

    /**
     * Entry point for standard user creation
     */
    static create(options: { role?: UserRole } = {}, f: any): User {
        const role = options.role || UserRole.User;
        return this.assemble(role, f, options);
    }

    /**
     * Predefined System Users (Saucedemo specific)
     */
    static createFromSystem(key: SystemUserKey, overrides: Partial<User> = {}): User {
        return {
            ...SYSTEM_USERS[key],
            _cleanup: true,
            ...overrides,
        };
    }

    /**
     * Collection Factory for Data-Driven testing
     */
    static createMany(count: number = 3, f: any, overrides: Partial<User> = {}): User[] {
        return Array.from({ length: count }, () => this.create({ role: UserRole.User }, f));
    }
}
