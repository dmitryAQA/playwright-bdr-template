import { expect, type StepOptions, type Product, InventoryPage } from '../fixtures';
import { Step } from '../bdr/decorators';

export class InventoryFlow {
    constructor(private inventoryPage: InventoryPage) {}

    @Step('WHEN: User adds product "{0.name}" to the cart')
    async addItemToCart(product: Product) {
        await this.inventoryPage.addItem(product.id);
    }

    @Step('THEN: The cart badge should show "{0}"')
    async verifyCartBadge(count: string, options: StepOptions = {}) {
        await expect(this.inventoryPage.cartBadge).toHaveText(count);
    }

    @Step('WHEN: User proceeds to cart')
    async goToCart() {
        await this.inventoryPage.goToCart();
    }
}
