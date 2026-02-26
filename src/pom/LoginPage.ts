import { Page, Locator } from '@playwright/test';

export class LoginPage {
    constructor(private page: Page) { }

    get usernameInput() { return this.page.getByPlaceholder(/username/i); }
    get passwordInput() { return this.page.getByPlaceholder(/password/i); }
    get loginButton() { return this.page.getByRole('button', { name: /login/i }); }
    get errorMessage() { return this.page.locator('[data-test="error"]'); }

    async open() {
        await this.page.goto('/');
    }

    async fillUsername(username: string) {
        await this.usernameInput.fill(username);
    }

    async fillPassword(password: string) {
        await this.passwordInput.fill(password);
    }

    async clickLogin() {
        await this.loginButton.click();
    }
}
