import { test } from '@playwright/test';
import { formatTitle } from './utils';

/**
 * BDD Style wrappers for Playwright steps.
 * Allows writing tests like:
 * await BDD.Given('User is on login page', async () => { ... });
 */
export const BDR = {
    Given: async (name: string, ...args: any[]) => {
        const body = args.pop();
        if (typeof body !== 'function') {
            throw new Error(`BDR.Given: Last argument must be a function (step body). Received: ${typeof body}`);
        }
        const stepName = `GIVEN: ${formatTitle(name, args)}`;
        return test.step(stepName, async () => {
            // We pass the args to the body in case it wants them,
            // though typically closures capture variables.
            // But for reusable steps, passing them is cleaner.
            if (body.length > 0) {
                return await body(...args);
            }
            return await body();
        });
    },

    When: async (name: string, ...args: any[]) => {
        const body = args.pop();
        if (typeof body !== 'function') {
            throw new Error(`BDR.When: Last argument must be a function (step body). Received: ${typeof body}`);
        }
        const stepName = `WHEN: ${formatTitle(name, args)}`;
        return test.step(stepName, async () => {
            if (body.length > 0) {
                return await body(...args);
            }
            return await body();
        });
    },

    Then: async (name: string, ...args: any[]) => {
        const body = args.pop();
        if (typeof body !== 'function') {
            throw new Error(`BDR.Then: Last argument must be a function (step body). Received: ${typeof body}`);
        }
        const stepName = `THEN: ${formatTitle(name, args)}`;
        return test.step(stepName, async () => {
            if (body.length > 0) {
                return await body(...args);
            }
            return await body();
        });
    },

    And: async (name: string, ...args: any[]) => {
        const body = args.pop();
        if (typeof body !== 'function') {
            throw new Error(`BDR.And: Last argument must be a function (step body). Received: ${typeof body}`);
        }
        const stepName = `AND: ${formatTitle(name, args)}`;
        return test.step(stepName, async () => {
            if (body.length > 0) {
                return await body(...args);
            }
            return await body();
        });
    },
};
