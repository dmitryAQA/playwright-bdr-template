import { test as base } from './flows';
import { ProductFactory } from '../factories/ProductFactory';
import { ProfileFactory } from '../factories/ProfileFactory';
import { UserFactory } from '../factories/UserFactory';

export type FactoryFixtures = {
    productFactory: typeof ProductFactory;
    profileFactory: typeof ProfileFactory;
    userFactory: typeof UserFactory;
};

export const test = base.extend<FactoryFixtures>({
    productFactory: async ({}, use: (r: typeof ProductFactory) => Promise<void>) => {
        await use(ProductFactory);
    },

    profileFactory: async ({}, use: (r: typeof ProfileFactory) => Promise<void>) => {
        await use(ProfileFactory);
    },

    userFactory: async ({}, use: (r: typeof UserFactory) => Promise<void>) => {
        await use(UserFactory);
    },
});
