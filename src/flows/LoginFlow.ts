import { expect } from '@playwright/test';
import { Step, StepOptions } from '../bdr/decorators';
import { User } from '../types/BusinessEntities';
import { LoginPage } from '../pom/LoginPage';
import { InventoryPage } from '../pom/InventoryPage';

export class LoginFlow {
    // DI: Inject POMs
    constructor(
        private loginPage: LoginPage,
        private inventoryPage: InventoryPage // Need this to verify successful login
    ) { }

    @Step('GIVEN: User is on the login page', { retryable: true })
    async open(options: StepOptions = {}) {
        await this.loginPage.open();
    }

    @Step('WHEN: User logs in with user "{0.username}"')
    async login(user: User, options: StepOptions = {}) {
        await this.loginPage.usernameInput.fill(user.username);
        // Assuming user.password exists, but User entity currently only has email/role/username.
        // For demo purposes, we'll hardcode or assume a generic password if not present.
        await this.loginPage.passwordInput.fill('secret_sauce');
        await this.loginPage.loginButton.click();
    }

    @Step('THEN: The inventory page should be visible')
    async verifyInventoryVisible(options: StepOptions = {}) {
        // Business check: Are we on the inventory page?
        await expect(this.inventoryPage.inventoryList).toBeVisible();
    }

    @Step('THEN: Error message "{0}" should be displayed')
    async verifyErrorMessage(message: string, options: StepOptions = {}) {
        await expect(this.loginPage.errorMessage).toContainText(message);
    }
}
