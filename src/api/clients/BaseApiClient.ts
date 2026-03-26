import { APIRequestContext, APIResponse } from '@playwright/test';
import { generateIdempotencyKey } from '../infrastructure/Idempotency';

/**
 * BaseApiClient (Architect Pattern: Infrastructure Layer)
 *
 * Provides shared capabilities for all specific API Clients:
 * 1. Automatic Idempotency Key injection.
 * 2. Shared request context management.
 * 3. Base for unified logging and error handling.
 */
export abstract class BaseApiClient {
    constructor(protected request: APIRequestContext) {}

    /**
     * Executes a POST request with automatic idempotency protection.
     */
    protected async post(url: string, data?: any): Promise<APIResponse> {
        // Automatically inject the idempotency key for all POST operations
        const idempotencyKey = generateIdempotencyKey('POST', url, data);

        return await this.request.post(url, {
            data,
            headers: {
                'X-Idempotency-Key': idempotencyKey,
            },
        });
    }

    /**
     * Executes a GET request.
     */
    protected async get(url: string): Promise<APIResponse> {
        return await this.request.get(url);
    }
}
