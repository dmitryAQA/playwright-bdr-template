import { Step } from '../bdr/decorators';
import { Product } from '../types/BusinessEntities';
import { attachTable } from '../bdr/tables';

/**
 * ProductFlow
 * Demonstrates BDR's ability to work with Product entities
 * and data-driven testing with collections
 */
export class ProductFlow {
    constructor(private products: Product[]) { }

    @Step('GIVEN: I have a product catalog with {0} items')
    async logProducts(count: number) {
        await attachTable('Source Product Catalog', this.products);
    }

    @Step('WHEN: I filter products by category "{0}"')
    async filterByCategory(category: string) {
        const filtered = this.products.filter(p => p.category === category);
        await attachTable(`Filtered Products: ${category}`, filtered);
        return filtered;
    }

    @Step('WHEN: I sort products by price {0}')
    async sortByPrice(order: 'asc' | 'desc') {
        const sorted = [...this.products].sort((a, b) =>
            order === 'asc' ? a.price - b.price : b.price - a.price
        );
        await attachTable(`Sorted Products (${order})`, sorted);
        return sorted;
    }

    @Step('THEN: The product catalog should be displayed')
    async verifyCatalogDisplayed() {
        // Attach product table to report for rich diagnostics
        await attachTable('Product Catalog', this.products);
        console.log('Product catalog verified and attached to report');
    }

    @Step('THEN: The total price should be calculated')
    async calculateTotalPrice() {
        const total = this.products.reduce((sum, p) => sum + p.price, 0);
        console.log(`Total price: $${total.toFixed(2)}`);

        // Attach summary table
        await attachTable('Price Summary', [
            { 'Total Items': this.products.length, 'Total Price': `$${total.toFixed(2)}` }
        ]);

        return total;
    }
}
