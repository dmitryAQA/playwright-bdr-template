import { expect } from '@playwright/test';
import { UserApi } from '../api/UserApi';
import { Step } from '../bdr/decorators';

export class UserFlow {
    constructor(private userApi: UserApi) { }

    @Step('WHEN: User logs in via API as "{0}"')
    async login(username: string) {
        const response = await this.userApi.login(username);
        expect(response.ok(), 'API login should be successful').toBe(true);
    }

    @Step('THEN: User profile should be accessible via API')
    async verifyProfileIsAccessible() {
        const response = await this.userApi.getProfile();
        expect(response.ok(), 'User profile should be accessible').toBe(true);
    }
}
