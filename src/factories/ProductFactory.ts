import { Product } from '../types/BusinessEntities';

export class ProductFactory {
    static createStandardProduct(): Product {
        return {
            name: 'Backpack',
            description: 'A standard backpack',
            price: 29.99,
            category: 'clothing'
        };
    }

    /**
     * BDR Collection Factory
     * Returns an array of products for Data Slicing demo
     */
    static createProducts(count: number = 3): Product[] {
        return Array.from({ length: count }, (_, i) => ({
            name: `Product ${i + 1}`,
            description: `Description for product ${i + 1}`,
            price: 10 + i * 5,
            category: 'electronics'
        }));
    }
}
