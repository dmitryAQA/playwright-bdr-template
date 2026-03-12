/**
 * BDD Style Step Builder
 *
 * BDD Style wrappers for Playwright steps with integrated retry mechanism.
 * Allows writing tests like:
 *   await BDR.Given('User is on login page', async () => { ... });
 *   await BDR.When('User enters credentials', user, async (u) => { ... });
 *   await BDR.Then('User sees dashboard', async () => { ... });
 */

import { test, Page } from '@playwright/test';
import { formatTitle } from './utils';
import { getPlugins, getBaseURL, getAxiom } from './index';
// Axiom is accessed via getAxiom() to ensure zero-dependency if folder is missing
import { StepOptions } from './decorators';

/**
 * Track which pages have infra detector attached
 */
const attachedPages = new WeakSet<Page>();

/**
 * Attach infra detector to a page if not already attached
 * NOTE: With true architecture, this should ideally be handled by Axiom itself,
 * but keeping it here for backward compatibility until a deeper refactor.
 */
function attachInfraDetector(page: Page, options?: any): void {
    if (attachedPages.has(page)) {
        return;  // Already attached
    }

    const axiom = getAxiom();
    if (axiom) {
        axiom.attachToPage(page);
    } else {
        // Fallback or explicit warning if needed
    }
    attachedPages.add(page);
}

/**
 * Create a step function with the given prefix (Given/When/Then/And)
 * Integrates hook execution for all registered plugins.
 */
const createStep = (prefix: string) => {
    return async (name: string, ...args: any[]): Promise<any> => {
        // Last argument should be the step body function
        const body = args.pop();

        if (typeof body !== 'function') {
            throw new Error(
                `BDR.${prefix}: Last argument must be a function (step body). ` +
                `Received: ${typeof body}`
            );
        }

        // Detect if StepOptions were provided as the new last argument in args
        let options: any = {};
        if (args.length > 0) {
            const lastArg = args[args.length - 1];
            // If it's an object and has BDR-specific keys, consider it options
            if (typeof lastArg === 'object' && lastArg !== null && ('stepId' in lastArg || 'retryable' in lastArg)) {
                options = args.pop();
            }
        }

        // Format step name with prefix and remaining interpolated arguments
        const stepName = `${prefix.toUpperCase()}: ${formatTitle(name, args)}`;

        // Wrap the final execution body
        const executionFn = async () => (body.length > 0 ? body(...args) : body());

        // Check for Axiom Engine
        const axiom = getAxiom();
        let currentStepFn: () => Promise<any>;

        if (axiom) {
            // Axiom Version: Uses smart retries and classification
            currentStepFn = async () => axiom.executeGroup(stepName, executionFn, options);
        } else {
            // Graceful Degradation: Standard Playwright step
            currentStepFn = async () => test.step(stepName, executionFn);
        }

        // Apply OTHER plugin hooks (backward compatibility)
        const plugins = getPlugins();
        for (const plugin of plugins) {
            // Skip old Resilience/History if they're still in plugins list by chance
            if (plugin.name === 'resilience' || plugin.name === 'history') continue;

            if (plugin.executeStep) {
                const prevFn = currentStepFn;
                currentStepFn = () => plugin.executeStep!(stepName, prevFn);
            }
        }

        // Execute the fully wrapped step
        return currentStepFn();
    };
};

/**
 * BDR - BDD-style step builder
 *
 * Usage:
 * ```typescript
 * await BDR.Given('user on login page', () => LoginPage.open());
 * await BDR.When('user enters {}', credentials, (creds) => LoginPage.login(creds));
 * await BDR.Then('user sees dashboard', () => expect(page.url()).toContain('dashboard'));
 * ```
 */
export const BDR = {
    Given: createStep('Given'),
    When: createStep('When'),
    Then: createStep('Then'),
    And: createStep('And'),
};

// Export for fixtures
export { attachInfraDetector };
