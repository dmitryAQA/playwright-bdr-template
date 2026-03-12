import { createHash } from 'crypto';

/**
 * Lead Standard: Idempotency Utility
 * 
 * Generates a unique, deterministic hash from the request context.
 * Used to populate 'X-Idempotency-Key' headers to prevent duplicate 
 * operations during network retries or eventual consistency gaps.
 */
export function generateIdempotencyKey(method: string, url: string, data: any): string {
    // Stable serialization: ensure keys are always in the same order
    const stableStringify = (obj: any) =>
        JSON.stringify(obj, obj ? Object.keys(obj).sort() : undefined);

    const payload = `${method}:${url}:${stableStringify(data)}`;

    return createHash('sha256')
        .update(payload)
        .digest('hex')
        .slice(0, 16); // Short hash is usually enough for test isolation
}
