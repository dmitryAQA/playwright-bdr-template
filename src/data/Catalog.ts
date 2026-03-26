import { ProductCategory } from '../types/BusinessEntities';

/**
 * Catalog of products from the Sauce Labs demo site.
 * This is the "Source of Truth" for product attributes.
 */
export const CATALOG = {
    BACKPACK: {
        id: 'sauce-labs-backpack',
        name: 'Sauce Labs Backpack',
        price: 29.99,
        category: ProductCategory.Clothing,
        description:
            'carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop protection.',
    },
    BIKE_LIGHT: {
        id: 'sauce-labs-bike-light',
        name: 'Sauce Labs Bike Light',
        price: 9.99,
        category: ProductCategory.Electronics,
        description: "A red light isn't the only thing that keeps you safe.",
    },
    BOLT_TSHIRT: {
        id: 'sauce-labs-bolt-t-shirt',
        name: 'Sauce Labs Bolt T-Shirt',
        price: 15.99,
        category: ProductCategory.Clothing,
        description: 'Get your testing superhero on with the Sauce Labs bolt T-shirt.',
    },
    FLEECE_JACKET: {
        id: 'sauce-labs-fleece-jacket',
        name: 'Sauce Labs Fleece Jacket',
        price: 49.99,
        category: ProductCategory.Clothing,
        description: "It's not every day that you come across a passionate fleece jacket.",
    },
    ONESIE: {
        id: 'sauce-labs-onesie',
        name: 'Sauce Labs Onesie',
        price: 7.99,
        category: ProductCategory.Clothing,
        description:
            "Rib snap closure for easy changing. Made with 100% cotton, it's the cutest addition to your wardrobe.",
    },
    RED_TSHIRT: {
        id: 'test.allthethings()-t-shirt-(red)',
        name: 'Test.allTheThings() T-Shirt (Red)',
        price: 15.99,
        category: ProductCategory.Clothing,
        description: 'This classic Sauce Labs t-shirt is perfect for testing all the things.',
    },
} as const;

export type CatalogKey = keyof typeof CATALOG;
