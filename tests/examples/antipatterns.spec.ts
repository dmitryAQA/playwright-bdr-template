import { test, expect } from '../../src/fixtures';

/**
 * Lead Hall of Shame: Anti-patterns (Rules #9-11)
 *
 * This file contains examples of code that will either be caught by ESLint
 * or lead to flaky tests.
 */

test.describe('Hall of Shame Examples', () => {
    test('Antipattern:toBeHidden without trigger (Rule #11)', async ({ page }) => {
        await page.goto('https://www.saucedemo.com/');

        // BAD: This might pass even if the element was never supposed to be hidden,
        // just because we didn't wait for the action to actually start/finish.
        await expect(page.locator('.error-message')).toBeHidden();

        // GOOD: Wait for the trigger first (e.g. click and wait for response),
        // then confirm disappearance.
        await page.getByRole('button', { name: 'Login' }).click();
        await expect(page.getByTestId('error-message')).toBeVisible();
        await page.getByRole('button', { name: 'Close' }).click();
        await expect(page.getByTestId('error-message')).toBeHidden();
    });

    /**
     * NOTE: The following would be caught by ESLint:
     *
     * 1. import { faker } from '@faker-js/faker'; // error: no-restricted-imports
     *
     * 2. class MyPage {
     *      private myState: string; // error: POM must be stateless
     *    }
     *
     * 3. class MyFlow {
     *      async doSomething() {} // error: Must have @Step decorator
     *    }
     */
});
