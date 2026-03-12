import { expect } from '@playwright/test';
import { Step } from '../bdr/decorators';
import { Product } from '../types/BusinessEntities';
import { CartPage } from '../pom/CartPage';

export class CartFlow {
    constructor(private cartPage: CartPage) { }

    @Step('THEN: The cart should contain product "{0.name}"')
    async verifyItemInCart(product: Product) {
        // We use the POM to find the element, then assert on it
        const item = await this.cartPage.getCartItem(product.name);
        await expect(item).toBeVisible();
    }

    @Step('WHEN: User clicks Checkout')
    async clickCheckout() {
        await this.cartPage.clickCheckout();
    }
}
