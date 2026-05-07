/* eslint-disable no-restricted-syntax */
import { Page, APIRequestContext } from '@playwright/test';
import { AuthFlow } from './AuthFlow';
import { InventoryFlow } from './InventoryFlow';
import { CartFlow } from './CartFlow';
import { UserFlow } from './UserFlow';
import { LoginPage } from '../pom/LoginPage';
import { InventoryPage } from '../pom/InventoryPage';
import { CartPage } from '../pom/CartPage';
import { UserApiClient } from '../api/clients/UserApiClient';
import { createIdempotentApi } from '../api/infrastructure/ApiWrapper';
import { TestConfig } from '../config/TestConfig';

/**
 * Factory for creating business flow instances.
 *
 * Centralizes object composition so that constructor changes
 * require edits in only one place, while keeping dependencies
 * explicit in every test.
 */
export function createAuthFlow(page: Page): AuthFlow {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    return new AuthFlow(loginPage, inventoryPage);
}

export function createInventoryFlow(page: Page): InventoryFlow {
    const inventoryPage = new InventoryPage(page);
    return new InventoryFlow(inventoryPage);
}

export function createCartFlow(page: Page): CartFlow {
    const cartPage = new CartPage(page);
    return new CartFlow(cartPage, page);
}

export function createUserFlow(request: APIRequestContext): UserFlow {
    const api = createIdempotentApi(request, TestConfig.runId);
    const userApi = new UserApiClient(api);
    return new UserFlow(userApi);
}
