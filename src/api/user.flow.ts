import { expect } from '@playwright/test';
import { UserApi } from './user.api';
import { BDR } from '../bdr/bdr';

export class UserFlow {
    constructor(private userApi: UserApi) { }

    async login(username: string) {
        await BDR.When('User logs in via API as {}', username, async () => {
            const response = await this.userApi.login(username);
            expect(response.ok()).toBeTruthy();
        });
    }

    async verifyProfileIsAccessible() {
        await BDR.Then('User profile is accessible via API', async () => {
            const response = await this.userApi.getProfile();
            expect(response.ok()).toBeTruthy();
        });
    }
}
