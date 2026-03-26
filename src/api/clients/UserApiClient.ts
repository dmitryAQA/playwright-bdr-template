import { APIRequestContext } from '@playwright/test';
import { BaseApiClient } from './BaseApiClient';
import { ENDPOINTS } from '../constants/Endpoints';
import { UserProfile } from '../../types/BusinessEntities';

/**
 * UserApiClient (Architect Pattern: Client Layer)
 *
 * High-level client for User-related API operations.
 * Inherits automatic idempotency and shared logic from BaseApiClient.
 */
export class UserApiClient extends BaseApiClient {
    constructor(request: APIRequestContext) {
        super(request);
    }

    /**
     * Authenticate user via API
     */
    async login(username: string, password?: string) {
        return await this.post(ENDPOINTS.USER.LOGIN, {
            username,
            password,
        });
    }

    /**
     * Fetch user profile data (Strongly Typed Response)
     */
    async getProfile(): Promise<UserProfile> {
        const response = await this.get(ENDPOINTS.USER.PROFILE);

        if (!response.ok()) {
            throw new Error(`Failed to fetch user profile: ${response.statusText()}`);
        }

        return (await response.json()) as UserProfile;
    }
}
