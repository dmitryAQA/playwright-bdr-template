import { test, expect } from '../../src/fixtures';
import { CATALOG } from '../../src/data/Catalog';
import { User } from '../../src/types/BusinessEntities';
import { createAuthFlow } from '../../src/flows';
import path from 'path';

/**
 * Authentication Setup
 *
 * Demonstrates a pro-level pattern for persistent state management.
 * In a real-world scenario, this project would perform login for different user roles
 * and save their storageState to be reused by the main test suite,
 * drastically reducing authentication overhead.
 */
const authFile = path.join(__dirname, '../../playwright/.auth/user.json');

test('Authenticate as Standard User', async ({ page, baseURL }) => {
    expect(baseURL).toBeDefined();

    const authFlow = createAuthFlow(page);

    console.log('Performing Global Auth Setup via AuthFlow...');

    // Using the same Business Flow as the main tests (Lead Standard)
    await authFlow.open();
    await authFlow.loginAs({ username: 'standard_user', password: 'secret_sauce' } as User);

    // Verify we are logged in - important for 'Living Requirements'
    await expect(page).toHaveURL(/inventory.html/);

    // Save the state
    await page.context().storageState({ path: authFile });
    console.log(`Auth state saved to: ${authFile}`);
});
