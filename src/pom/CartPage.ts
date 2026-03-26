import { Page, Locator } from '@playwright/test';

export class CartPage {
    constructor(private page: Page) {}

    get cartItems() {
        return this.page.getByTestId('inventory-item');
    }
    get checkoutButton() {
        return this.page.getByRole('button', { name: /checkout/i });
    }

    /**
     * Locate a cart item entry by the product ID (slug)
     */
    getCartItem(productId: string): Locator {
        // In the cart, we can identify unique items by their remove buttons
        return this.page.getByTestId(`remove-${productId}`);
    }

    async clickCheckout() {
        await this.checkoutButton.click();
    }
}
