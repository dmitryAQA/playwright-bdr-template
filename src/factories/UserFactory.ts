import { User } from '../types/BusinessEntities';

/**
 * UserFactory
 * Factory for creating test user data
 */
export class UserFactory {
    /**
     * Creates a standard user with default values
     */
    static createStandardUser(): User {
        return {
            username: 'standard_user',
            role: 'user',
            email: 'standard@test.com'
        };
    }

    /**
     * Creates an admin user with elevated privileges
     */
    static createAdminUser(): User {
        return {
            username: 'admin_user',
            role: 'admin',
            email: 'admin@test.com'
        };
    }

    /**
     * Creates a guest user with limited access
     */
    static createGuestUser(): User {
        return {
            username: 'guest_user',
            role: 'guest',
            email: 'guest@test.com'
        };
    }

    /**
     * BDR Collection Factory
     * Returns an array of users for Data-Driven testing
     */
    static createUsers(count: number = 3): User[] {
        const roles: ('admin' | 'user' | 'guest')[] = ['admin', 'user', 'guest'];
        return Array.from({ length: count }, (_, i) => ({
            username: `test_user_${i + 1}`,
            role: roles[i % roles.length],
            email: `user${i + 1}@test.com`
        }));
    }

    /**
     * Creates a custom user with specific properties
     */
    static createCustomUser(username: string, role: 'admin' | 'user' | 'guest', email: string): User {
        return { username, role, email };
    }
}
