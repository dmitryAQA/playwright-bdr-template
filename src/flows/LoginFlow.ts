import { expect } from '@playwright/test';
import { Step } from '../bdr/decorators';
import { LoginPage } from '../pom/LoginPage';
import { InventoryPage } from '../pom/InventoryPage';

export class LoginFlow {
    // DI: Inject POMs
    constructor(
        private loginPage: LoginPage,
        private inventoryPage: InventoryPage // Need this to verify successful login
    ) { }

    @Step('GIVEN: User is on the login page')
    async open() {
        await this.loginPage.navigate();
    }

    @Step('WHEN: User logs in with username "{0}" and password "{1}"')
    async login(username: string, password: string = 'secret_sauce') {
        await this.loginPage.fillUsername(username);
        await this.loginPage.fillPassword(password);
        await this.loginPage.clickLogin();
    }

    @Step('THEN: The inventory page should be visible')
    async verifyInventoryVisible() {
        // Business check: Are we on the inventory page?
        await expect(this.inventoryPage.inventoryList).toBeVisible();
    }

    @Step('THEN: Error message "{0}" should be displayed')
    async verifyErrorMessage(message: string) {
        await expect(this.loginPage.errorMessage).toContainText(message);
    }
}
