import { Product } from '../types/BusinessEntities';

/**
 * ProductFactory (Rule #4: Data-Driven Determinism)
 */
export class ProductFactory {
    static createStandardProduct(overrides: Partial<Product> = {}, f: any): Product {
        if (!f) throw new Error('Faker instance must be provided to Factory. Use the "faker" fixture in tests.');
        return {
            name: f.commerce.productName(),
            description: f.commerce.productDescription(),
            price: Number(f.commerce.price()),
            category: 'clothing',
            _cleanup: true,
            ...overrides
        };
    }

    /**
     * BDR Collection Factory
     */
    static createProducts(count: number = 3, f: any, overrides: Partial<Product> = {}): Product[] {
        return Array.from({ length: count }, () => this.createStandardProduct(overrides, f));
    }
}
