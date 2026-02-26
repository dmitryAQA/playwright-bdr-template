import { expect } from '@playwright/test';
import { Step } from '../bdr/decorators';
import { InventoryPage } from '../pom/InventoryPage';

export class InventoryFlow {
    constructor(private inventoryPage: InventoryPage) { }

    @Step('WHEN: User adds product "{0}" to the cart')
    async addItemToCart(productName: string) {
        await this.inventoryPage.addItem(productName);
    }

    @Step('THEN: The cart badge should show "{0}"')
    async verifyCartBadge(count: string) {
        await expect.soft(this.inventoryPage.cartBadge).toHaveText(count);
    }

    @Step('WHEN: User proceeds to cart')
    async goToCart() {
        await this.inventoryPage.goToCart();
    }
}
