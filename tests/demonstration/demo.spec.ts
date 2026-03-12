import { test } from '../../src/fixtures';
import { User, Product } from '../../src/types/BusinessEntities';

test.describe('Class-Based BDR Demo (Recommended)', () => {

    test('E2E Purchase Flow: Login -> Add to Cart -> Checkout', async ({ loginFlow, inventoryFlow, cartFlow }) => {
        const testUser: User = { username: 'standard_user', role: 'user', email: 'test@test.com' };
        const testProduct: Product = { name: 'Sauce Labs Backpack', price: 29.99, description: 'Cool backpack', category: 'clothing' };

        // 1. Arrange (Given)
        await loginFlow.open();
        await loginFlow.login(testUser);
        await loginFlow.verifyInventoryVisible();

        // 2. Act (When)
        await inventoryFlow.addItemToCart(testProduct);
        await inventoryFlow.verifyCartBadge('1');
        await inventoryFlow.goToCart();

        // 3. Assert (Then)
        await cartFlow.verifyItemInCart(testProduct);
        await cartFlow.clickCheckout();
    });

    test('Failed login via BDR Flow', async ({ loginFlow }) => {
        const lockedUser: User = { username: 'locked_out_user', role: 'user', email: 'locked@test.com' };
        await loginFlow.open();
        await loginFlow.login(lockedUser);
        await loginFlow.verifyErrorMessage('Sorry, this user has been locked out.');
    });
});
