import {
    test,
    BDR,
    attachTable,
    UserFactory,
    ProductFactory,
    AuthFlow,
    InventoryFlow,
    CartFlow,
    LoginPage,
    InventoryPage,
    CartPage,
    Page,
} from '../../src/fixtures';

/* eslint-disable no-restricted-syntax */
function createAuthFlow(page: Page) {
    return new AuthFlow(new LoginPage(page), new InventoryPage(page));
}

function createInventoryFlow(page: Page) {
    return new InventoryFlow(new InventoryPage(page));
}

function createCartFlow(page: Page) {
    return new CartFlow(new CartPage(page), page);
}
/* eslint-enable no-restricted-syntax */

test.describe('Class-Based BDR Demo (Recommended / Golden Standard)', () => {
    test('E2E Purchase Flow: Login -> Add to Cart -> Checkout', async ({ page }) => {
        const authFlow = createAuthFlow(page);
        const inventoryFlow = createInventoryFlow(page);
        const cartFlow = createCartFlow(page);

        // Data-Driven Determinism (Rule #4)
        const testUser = UserFactory.createFromSystem('STANDARD');
        const testProduct = ProductFactory.createFromCatalog('BACKPACK');

        await BDR.Given('User is logged in as standard_user', async () => {
            // Rich Diagnostics: show who we are logging in as
            await attachTable('Pre-test Verification', [testUser, testProduct]);

            await authFlow.open();
            await authFlow.loginAs(testUser);
            await authFlow.verifyInventoryVisible();
        });

        await BDR.When('User adds {} to cart', testProduct.name, async () => {
            await inventoryFlow.addItemToCart(testProduct);
            await inventoryFlow.verifyCartBadge('1');
            await inventoryFlow.goToCart();
        });

        await BDR.Then('The {} should be available for checkout in the cart', testProduct.name, async () => {
            await cartFlow.verifyItemInCart(testProduct);
            await cartFlow.clickCheckout();
        });
    });

    test('Failed login via BDR Flow', async ({ page }) => {
        const authFlow = createAuthFlow(page);
        const lockedUser = UserFactory.createFromSystem('LOCKED_OUT');

        await BDR.Given('User is on the login page', async () => {
            await authFlow.open();
        });

        await BDR.When('User attempts to login as {}', lockedUser.username, async () => {
            await authFlow.loginAs(lockedUser);
        });

        await BDR.Then('A locked-out message should be visible', async () => {
            await authFlow.verifyErrorMessage('Sorry, this user has been locked out.');
        });
    });
});
