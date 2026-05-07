/* eslint-disable no-restricted-syntax */
import { test as base } from './pom';
import { UserApiClient } from '../api/clients/UserApiClient';
import { createIdempotentApi } from '../api/infrastructure/ApiWrapper';
import { APIRequestContext } from '@playwright/test';

export type FlowFixtures = {
    authFlow: any;
    inventoryFlow: any;
    cartFlow: any;
    userFlow: any;
};

export const test = base.extend<FlowFixtures>({
    authFlow: async (
        { loginPage, inventoryPage }: { loginPage: any; inventoryPage: any },
        use: (r: any) => Promise<void>,
    ) => {
        const { AuthFlow } = await import('../flows/AuthFlow');
        await use(new AuthFlow(loginPage, inventoryPage));
    },

    inventoryFlow: async ({ inventoryPage }: { inventoryPage: any }, use: (r: any) => Promise<void>) => {
        const { InventoryFlow } = await import('../flows/InventoryFlow');
        await use(new InventoryFlow(inventoryPage));
    },

    cartFlow: async ({ cartPage, page }: { cartPage: any; page: any }, use: (r: any) => Promise<void>) => {
        const { CartFlow } = await import('../flows/CartFlow');
        await use(new CartFlow(cartPage, page));
    },

    userFlow: async (
        { request, runId }: { request: APIRequestContext; runId: string },
        use: (r: any) => Promise<void>,
    ) => {
        const api = createIdempotentApi(request, runId);
        const userApi = new UserApiClient(api);
        const { UserFlow } = await import('../flows/UserFlow');
        await use(new UserFlow(userApi));
    },
});
