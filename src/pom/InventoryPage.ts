import { Page, Locator } from '@playwright/test';

export class InventoryPage {
    readonly inventoryList: Locator;
    readonly cartBadge: Locator;
    readonly cartLink: Locator;

    constructor(private page: Page) {
        this.inventoryList = page.locator('.inventory_list');
        this.cartBadge = page.locator('.shopping_cart_badge');
        this.cartLink = page.locator('.shopping_cart_link');
    }

    getAddToCartButton(productName: string): Locator {
        const id = productName.toLowerCase().replace(/ /g, '-');
        return this.page.locator(`[data-test="add-to-cart-${id}"]`);
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
