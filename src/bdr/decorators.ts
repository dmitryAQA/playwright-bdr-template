/**
 * @Step Decorator with Retry
 *
 * Universal @Step Decorator that wraps methods with:
 * 1. Playwright test.step for reporting
 * 2. Automatic retry for flaky errors (INFRA, DOM)
 *
 * Supports both:
 * 1. Legacy Decorators (experimentalDecorators: true) -> (target, prop, descriptor)
 * 2. Standard Decorators (Stage 3) -> (value, context)
 */

import { test } from '@playwright/test';
import { formatTitle } from './utils';
import { getPlugins, getAxiom } from './index';

export interface StepOptions {
    retryable?: boolean;
    stepId?: string;
}

/**
 * @Step Decorator
 *
 * Wraps a method with test.step and retry logic.
 *
 * @param title - Step title with optional placeholders {0}, {1}, {}
 * @param options - Optional step execution settings (retryable, stepId)
 *
 * @example
 * ```typescript
 * class LoginPage {
 *   @Step('Login as {0}')
 *   async login(user: User) {
 *     // ... login logic
 *   }
 * }
 * ```
 */
export function Step(title: string, options: StepOptions = {}) {
    return function (...args: any[]) {
        const [arg1, arg2, arg3] = args;

        /**
         * Wrap method with registered plugin logic
         */
        const wrapMethodInStep = (originalMethod: Function, title: string, context: any) => {
            return async function (this: any, ...methodArgs: any[]) {
                const stepName = formatTitle(title, methodArgs);

                // Start with the original method bounded correctly
                let currentStepFn = async () => originalMethod.apply(this, methodArgs);

                // Apply plugin wrapper hooks
                const plugins = getPlugins();
                const axiom = getAxiom();

                if (axiom) {
                    // Axiom Version: Uses smart retries and classification
                    currentStepFn = async () => axiom.executeGroup(stepName, currentStepFn, options);
                }

                for (const plugin of plugins) {
                    // Skip Axiom if handled above
                    if (plugin.name === 'axiom' || plugin.name === 'resilience') continue;

                    if (plugin.executeStep) {
                        const prevFn = currentStepFn;
                        currentStepFn = () => plugin.executeStep!(stepName, prevFn);
                    }
                }

                // If no plugins wrapped it (or even if they did), ensure it's at least reported as a step
                if (!axiom && plugins.length === 0) {
                    return test.step(stepName, currentStepFn);
                }

                return currentStepFn();
            };
        };

        // Standard Decorator (Stage 3)
        if (typeof arg2 === 'object' && arg2 !== null && 'kind' in arg2 && arg2.kind === 'method') {
            return wrapMethodInStep(arg1, title, arg2);
        }

        // Legacy Decorator
        if (typeof arg2 === 'string') {
            const descriptor = arg3 || Object.getOwnPropertyDescriptor(arg1, arg2);
            if (descriptor) {
                const originalMethod = descriptor.value;
                descriptor.value = wrapMethodInStep(originalMethod, title, arg1);
                return descriptor;
            }
        }

        console.warn(`@Step decorator warning: Unknown decorator signature or missing descriptor for step "${title}"`);
        // Return original if something goes wrong to avoid crashing
        return arg1;
    };
}
