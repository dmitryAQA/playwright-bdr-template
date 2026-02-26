import { Page, Locator } from '@playwright/test';

export class InventoryPage {
    constructor(private page: Page) { }

    get inventoryList() { return this.page.getByTestId('inventory-list'); }
    get cartBadge() { return this.page.getByTestId('shopping-cart-badge'); }
    get cartLink() { return this.page.getByTestId('shopping-cart-link'); }

    getAddToCartButton(productName: string): Locator {
        return this.page.getByTestId('inventory-item')
            .filter({ hasText: productName })
            .getByRole('button', { name: /add to cart/i });
    }

    async addItem(productName: string) {
        await this.getAddToCartButton(productName).click();
    }

    async getBadgeCount(): Promise<string> {
        return await this.cartBadge.textContent() || '0';
    }

    async goToCart() {
        await this.cartLink.click();
    }
}
