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
        console.log(`Product catalog loaded with ${count} items:`);
        this.products.forEach(p => console.log(` - ${p.name}: $${p.price}`));
    }

    @Step('WHEN: I filter products by category "{0}"')
    async filterByCategory(category: string) {
        const filtered = this.products.filter(p => p.category === category);
        console.log(`Found ${filtered.length} products in ${category}`);
        return filtered;
    }

    @Step('WHEN: I sort products by price {0}')
    async sortByPrice(order: 'asc' | 'desc') {
        const sorted = [...this.products].sort((a, b) =>
            order === 'asc' ? a.price - b.price : b.price - a.price
        );
        console.log(`Sorted products by price (${order}):`);
        sorted.forEach(p => console.log(` - ${p.name}: $${p.price}`));
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
