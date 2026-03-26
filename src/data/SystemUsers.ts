import { UserRole } from '../types/BusinessEntities';
import { TestConfig } from '../config/TestConfig';

/**
 * Standard system users for the Sauce Labs demo site.
 */
export const SYSTEM_USERS = {
    STANDARD: {
        username: 'standard_user',
        password: TestConfig.password,
        role: UserRole.User,
        email: 'standard@example.com',
    },
    ADMIN: {
        username: 'admin_user',
        password: TestConfig.password,
        role: UserRole.Admin,
        email: 'admin@example.com',
    },
    LOCKED_OUT: {
        username: 'locked_out_user',
        password: TestConfig.password,
        role: UserRole.User,
        email: 'locked@example.com',
    },
    DMITRY: {
        username: 'dmitry_sorvachev',
        password: TestConfig.password,
        role: UserRole.User,
        email: 'dmitry@example.com',
    },
    PROBLEM: {
        username: 'problem_user',
        password: TestConfig.password,
        role: UserRole.User,
        email: 'problem@example.com',
    },
    PERFORMANCE: {
        username: 'performance_glitch_user',
        password: TestConfig.password,
        role: UserRole.User,
        email: 'performance@example.com',
    },
    ERROR: {
        username: 'error_user',
        password: TestConfig.password,
        role: UserRole.User,
        email: 'error@example.com',
    },
    VISUAL: {
        username: 'visual_user',
        password: TestConfig.password,
        role: UserRole.User,
        email: 'visual@example.com',
    },
} as const;

export type SystemUserKey = keyof typeof SYSTEM_USERS;
