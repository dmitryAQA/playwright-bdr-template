import { Page, Locator } from '@playwright/test';

export class CartPage {
    constructor(private page: Page) { }

    get cartItems() { return this.page.getByTestId('inventory-item'); }
    get checkoutButton() { return this.page.getByRole('button', { name: /checkout/i }); }

    async getCartItem(productName: string): Promise<Locator> {
        return this.cartItems.filter({ hasText: productName }).first();
    }

    async clickCheckout() {
        await this.checkoutButton.click();
    }
}
