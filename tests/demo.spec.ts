import { test } from '../src/fixtures';

test.describe('Class-Based BDR Demo (Recommended)', () => {

    test('E2E Purchase Flow: Login -> Add to Cart -> Checkout', async ({ loginFlow, inventoryFlow, cartFlow }) => {
        // 1. Arrange (Given)
        await loginFlow.open();
        await loginFlow.login('standard_user', 'secret_sauce');
        await loginFlow.verifyInventoryVisible();

        // 2. Act (When)
        await inventoryFlow.addItemToCart('Sauce Labs Backpack');
        await inventoryFlow.verifyCartBadge('1');
        await inventoryFlow.goToCart();

        // 3. Assert (Then)
        await cartFlow.verifyItemInCart('Sauce Labs Backpack');
        await cartFlow.clickCheckout();
    });

    test('Failed login via BDR Flow', async ({ loginFlow }) => {
        await loginFlow.open();
        await loginFlow.login('locked_out_user', 'secret_sauce');
        await loginFlow.verifyErrorMessage('Sorry, this user has been locked out.');
    });
});
