import { test, expect } from '../../src/fixtures/index';
import { BDR } from '../../src/bdr/bdr';
import { attachCompareTable } from '../../src/bdr/tables';
import { UserFactory } from '../../src/factories/UserFactory';

test.describe('Rich Diagnostics Demonstration', () => {

    test('Failure Demo: Data Mismatch with Rich Table', async ({ page, faker }) => {
        // Rule #2: Use about:blank for speed in demonstrations
        await page.goto('about:blank');

        // Rule #4: Use Factories for deterministic data generation
        // Rule #6: Use the 'faker' fixture for DI
        const expectedUser = UserFactory.createAdminUser({
            role: 'admin'
        }, faker);

        // Intentionally create a mismatch for the BDR "Rich Diagnostics" demonstration
        const actualUser = { 
            ...expectedUser,
            role: 'editor' // Logic mismatch for the screenshot
        };

        await BDR.Then('User data should match the expected profile', async () => {
            // Rule: "Rich Diagnostics" - attach a side-by-side comparison table
            await attachCompareTable('User Data Verification', expectedUser, actualUser);
            
            // This assertion will fail, highlighting the mismatch in the report
            // but the test code itself now follows Lead-level patterns
            expect(actualUser.role).toBe(expectedUser.role);
        });
    });

});
