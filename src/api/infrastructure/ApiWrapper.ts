import { APIRequestContext } from '@playwright/test';
import { generateIdempotencyKey } from './Idempotency';

/**
 * ApiWrapper (Rule #12: API Infrastructure)
 *
 * Provides enhanced API request context with idempotency support.
 */

/**
 * Wraps Playwright's APIRequestContext to automatically add idempotency headers.
 * Rule: Unique per request body, stable per CI run.
 */
export function createIdempotentApi(request: APIRequestContext, runId: string) {
    const wrapMethod = (method: 'post' | 'put') => {
        return (url: string, options: any = {}) => {
            const key = generateIdempotencyKey(method, url, options.data);
            return request[method](url, {
                ...options,
                headers: {
                    ...options.headers,
                    'X-Idempotency-Key': `test-${runId}-${key}`,
                },
            });
        };
    };

    return {
        ...request,
        post: wrapMethod('post'),
        put: wrapMethod('put'),
    };
}
