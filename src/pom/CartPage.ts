import { Page, Locator } from '@playwright/test';

export class CartPage {
    readonly cartItems: Locator;
    readonly checkoutButton: Locator;

    constructor(private page: Page) {
        this.cartItems = page.locator('.cart_item');
        this.checkoutButton = page.locator('[data-test="checkout"]');
    }

    async getCartItem(productName: string): Promise<Locator> {
        return this.cartItems.filter({ hasText: productName }).first();
    }

    async clickCheckout() {
        await this.checkoutButton.click();
    }
}
