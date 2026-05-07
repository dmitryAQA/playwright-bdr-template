import { APIRequestContext } from '@playwright/test';
import { test as base } from './helpers';
import { createIdempotentApi } from '../api/infrastructure/ApiWrapper';

export type ApiFixtures = {
    api: any;
};

export const test = base.extend<ApiFixtures>({
    api: async ({ request, runId }: { request: APIRequestContext; runId: string }, use: (r: any) => Promise<void>) => {
        await use(createIdempotentApi(request, runId));
    },
});
