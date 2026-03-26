import { expect, Page } from '@playwright/test';
import { Step } from '../bdr/decorators';
import { Product } from '../types/BusinessEntities';
import { CartPage } from '../pom/CartPage';
import { attachTable } from '../bdr/tables';

export class CartFlow {
    constructor(
        private cartPage: CartPage,
        private page: Page,
    ) {}

    @Step('WHEN: User adds the following items to cart')
    async addItems(items: Product[]) {
        // Built-in HTML table generation for the report (Manifesto Standard)
        await attachTable('Selected Products', items);

        for (const item of items) {
            // Rule #2: Use data-testid for actions (Stable)
            await this.page.click(`[data-test="add-to-cart-${item.id}"]`);
        }
    }

    @Step('THEN: The cart should contain product "{0.name}"')
    async verifyItemInCart(product: Product) {
        const item = this.cartPage.getCartItem(product.id);
        await expect(item).toBeVisible();
    }

    @Step('WHEN: User clicks Checkout')
    async clickCheckout() {
        await this.cartPage.clickCheckout();
    }
}
