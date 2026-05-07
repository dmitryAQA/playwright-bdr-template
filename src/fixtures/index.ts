import { mergeTests, expect, type Page } from '@playwright/test';
import { test as helpers } from './helpers';
import { test as api } from './api';
import { test as pom } from './pom';
import { test as flows } from './flows';
import { test as factories } from './factories';
import { test as bdr } from './bdr';

import { AuthFlow } from '../flows/AuthFlow';
import { InventoryFlow } from '../flows/InventoryFlow';
import { CartFlow } from '../flows/CartFlow';
import { UserFlow } from '../flows/UserFlow';
import { LoginPage } from '../pom/LoginPage';
import { InventoryPage } from '../pom/InventoryPage';
import { CartPage } from '../pom/CartPage';
import { UserApiClient } from '../api/clients/UserApiClient';
import { ProductFactory } from '../factories/ProductFactory';
import { ProfileFactory } from '../factories/ProfileFactory';
import { UserFactory } from '../factories/UserFactory';
import { BDR } from '../bdr/bdr';
import { attachTable, attachCompareTable } from '../bdr/tables';

// Merge all fixture layers
export const test = mergeTests(helpers, api, pom, flows, factories, bdr);

export { expect };
export { type StepOptions } from '../bdr/decorators';
export { type User, type Product, UserRole } from '../types/BusinessEntities';
export type { SystemUserKey } from '../data/SystemUsers';
export type { CatalogKey } from '../data/Catalog';
export {
    AuthFlow,
    InventoryFlow,
    CartFlow,
    UserFlow,
    LoginPage,
    InventoryPage,
    CartPage,
    UserApiClient,
    ProductFactory,
    ProfileFactory,
    UserFactory,
    BDR,
    attachTable,
    attachCompareTable,
};

// Re-export types for consumers
export type { Page };
