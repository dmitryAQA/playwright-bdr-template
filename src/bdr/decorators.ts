import { test } from '@playwright/test';
import { formatTitle } from './utils';

/**
 * Universal @Step Decorator
 * Supports both:
 * 1. Legacy Decorators (experimentalDecorators: true) -> (target, prop, descriptor)
 * 2. Standard Decorators (Stage 3) -> (value, context)
 */
export function Step(title: string) {
    return function (...args: any[]) {
        const [arg1, arg2, arg3] = args;

        const wrapMethodInStep = (originalMethod: Function, title: string, context: any) => {
            return async function (this: any, ...methodArgs: any[]) {
                const stepName = formatTitle(title, methodArgs);
                return await test.step(stepName, async () => {
                    return await originalMethod.apply(this, methodArgs);
                });
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
