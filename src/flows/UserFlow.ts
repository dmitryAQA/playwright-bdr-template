import { expect } from '@playwright/test';
import { UserApi } from '../api/UserApi';
import { Step } from '../bdr/decorators';

export class UserFlow {
    constructor(private userApi: UserApi) { }

    @Step('WHEN: User logs in via API as "{0.username}"')
    async login(user: any) {
        const response = await this.userApi.login(user.username);
        expect(response.ok(), `API Login should be successful for user: ${user.username}`).toBe(true);
    }

    @Step('THEN: User profile should be accessible via API')
    async verifyProfileIsAccessible() {
        const response = await this.userApi.getProfile();
        expect(response.ok(), 'User profile should be accessible').toBe(true);
    }
}
