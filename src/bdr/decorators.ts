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

        // Check for Standard Decorator (Stage 3)
        // Context object has 'kind' property
        if (typeof arg2 === 'object' && arg2 !== null && 'kind' in arg2 && arg2.kind === 'method') {
            const originalMethod = arg1;
            const context = arg2;

            return async function replacementMethod(this: any, ...methodArgs: any[]) {
                const stepName = formatTitle(title, methodArgs);
                return await test.step(stepName, async () => {
                    return await originalMethod.apply(this, methodArgs);
                });
            };
        }

        // Check for Legacy Decorator
        // (target, propertyKey, descriptor)
        if (typeof arg2 === 'string') {
            const target = arg1;
            const propertyKey = arg2;
            let descriptor = arg3;

            // Fallback for missing descriptor
            if (!descriptor && target) {
                descriptor = Object.getOwnPropertyDescriptor(target, propertyKey);
            }

            if (descriptor) {
                const originalMethod = descriptor.value;
                descriptor.value = async function (...methodArgs: any[]) {
                    const stepName = formatTitle(title, methodArgs);
                    return await test.step(stepName, async () => {
                        return await originalMethod.apply(this, methodArgs);
                    });
                };
                return descriptor;
            }
        }

        console.warn(`@Step decorator warning: Unknown decorator signature or missing descriptor for step "${title}"`);
        // Return original if something goes wrong to avoid crashing
        return arg1;
    };
}
