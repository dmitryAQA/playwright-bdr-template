import { Product, ProductCategory } from '../types/BusinessEntities';
import { CATALOG, CatalogKey } from '../data/Catalog';

/**
 * ProductFactory (Rule #4: Data-Driven Determinism)
 */
export class ProductFactory {
    static createStandardProduct(overrides: Partial<Product> = {}, f: any): Product {
        if (!f) throw new Error('Faker instance must be provided to Factory. Use the "faker" fixture in tests.');
        return {
            id: f.string.uuid(),
            name: f.commerce.productName(),
            description: f.commerce.productDescription(),
            price: Number(f.commerce.price()),
            category: ProductCategory.Clothing,
            _cleanup: true,
            ...overrides,
        };
    }

    /**
     * Creates a product from the predefined Catalog.
     * Use this when you need a specific known product for your test.
     */
    static createFromCatalog(key: CatalogKey, overrides: Partial<Product> = {}): Product {
        return {
            ...CATALOG[key],
            _cleanup: true,
            ...overrides,
        };
    }

    /**
     * BDR Collection Factory
     */
    static createProducts(count: number = 3, f: any, overrides: Partial<Product> = {}): Product[] {
        return Array.from({ length: count }, () => this.createStandardProduct(overrides, f));
    }
}
