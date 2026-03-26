import { Page, Locator } from '@playwright/test';

export class InventoryPage {
    constructor(private page: Page) {}

    get inventoryList() {
        return this.page.getByTestId('inventory-list');
    }
    get cartBadge() {
        return this.page.getByTestId('shopping-cart-badge');
    }
    get cartLink() {
        return this.page.getByTestId('shopping-cart-link');
    }

    /**
     * Locate the "Add to Cart" button for a specific product by its ID (slug)
     */
    getAddToCartButton(productId: string): Locator {
        return this.page.getByTestId(`add-to-cart-${productId}`);
    }

    async addItem(productId: string) {
        await this.getAddToCartButton(productId).click();
    }

    async getBadgeCount(): Promise<string> {
        return (await this.cartBadge.textContent()) || '0';
    }

    async goToCart() {
        await this.cartLink.click();
    }
}
