import { Product } from '../types/BusinessEntities';
import { Factory } from './UserFactory'; // Assuming Factory decorator is there

@Factory('Product')
export class ProductFactory {
    static create(overrides?: Partial<Product>): Product {
        return {
            name: "Default Product",
            description: "Default Description",
            price: 9.99,
            category: "electronics",
            ...overrides
        };
    }

    static buildList(count: number, overrides?: Partial<Product>): Product[] {
        const list: Product[] = [];
        for (let i = 0; i < count; i++) {
            list.push(this.create(overrides));
        }
        return list;
    }
}
