import { expect, UserApiClient, type User } from '../fixtures';
import { Step } from '../bdr/decorators';

export class UserFlow {
    constructor(private userApi: UserApiClient) {}

    @Step('WHEN: User logs in via API as "{0.username}"')
    async login(user: { username: string; password?: string }) {
        const response = await this.userApi.login(user.username, user.password);
        expect(response.ok(), `API Login should be successful for user: ${user.username}`).toBe(true);
    }

    @Step('THEN: User profile should be accessible via API')
    async verifyProfileIsAccessible() {
        const profile = await this.userApi.getProfile();

        // Now featuring IDE autocompletion and type safety
        expect(profile.username).toBeDefined();
        expect(profile.status).toBe('Active');
    }
}
