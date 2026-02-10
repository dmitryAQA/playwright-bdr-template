import { test } from '@playwright/test';
import { formatTitle } from './utils';

/**
 * BDD Style wrappers for Playwright steps.
 * Allows writing tests like:
 * await BDD.Given('User is on login page', async () => { ... });
 */
const createStep = (prefix: string) => {
    return async (name: string, ...args: any[]) => {
        const body = args.pop();
        if (typeof body !== 'function') {
            throw new Error(`BDR.${prefix}: Last argument must be a function (step body). Received: ${typeof body}`);
        }
        const stepName = `${prefix.toUpperCase()}: ${formatTitle(name, args)}`;
        return test.step(stepName, async () => {
            return body.length > 0 ? await body(...args) : await body();
        });
    };
};

export const BDR = {
    Given: createStep('Given'),
    When: createStep('When'),
    Then: createStep('Then'),
    And: createStep('And'),
};
