import { Page, Locator } from '@playwright/test';

export class LoginPage {
    constructor(private page: Page) { }

    get usernameInput() { return this.page.getByTestId('username'); }
    get passwordInput() { return this.page.getByTestId('password'); }
    get loginButton() { return this.page.getByTestId('login-button'); }
    get errorMessage() { return this.page.getByTestId('error'); }

    async open() {
        await this.page.goto('/');
    }

    async login(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }
}
