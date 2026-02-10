import { expect } from '@playwright/test';
import { Step } from '../bdr/decorators';
import { CartPage } from '../pom/CartPage';

export class CartFlow {
    constructor(private cartPage: CartPage) { }

    @Step('THEN: The cart should contain "{0}"')
    async verifyItemInCart(productName: string) {
        // We use the POM to find the element, then assert on it
        const item = await this.cartPage.getCartItem(productName);
        await expect(item).toBeVisible();
    }

    @Step('WHEN: User clicks Checkout')
    async clickCheckout() {
        await this.cartPage.clickCheckout();
    }
}
