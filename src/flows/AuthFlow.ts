import { expect, type StepOptions, type User, LoginPage, InventoryPage } from '../fixtures';
import { Step } from '../bdr/decorators';

export class AuthFlow {
    // DI: Inject POMs
    constructor(
        private loginPage: LoginPage,
        private inventoryPage: InventoryPage, // Need this to verify successful login
    ) {}

    @Step('GIVEN: User is on the login page')
    async open(options: StepOptions = {}) {
        await this.loginPage.open();
    }

    @Step('WHEN: User logs in with user "{0.username}"')
    async loginAs(user: User, options: StepOptions = {}) {
        const password = user.password || 'secret_sauce';
        await this.loginPage.login(user.username, password);
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
