import { APIRequestContext } from '@playwright/test';

export class UserApi {
    constructor(private request: APIRequestContext) { }

    async login(username: string) {
        // In a real project, this would be a real POST request
        return await this.request.post('/api/login', {
            data: { username }
        });
    }

    async getProfile() {
        return await this.request.get('/api/profile');
    }
}
