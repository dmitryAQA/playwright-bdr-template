/**
 * CryptoUtils (Rule #11: Shared Utilities)
 *
 * Helper functions for hashing and deterministic data generation.
 */

/**
 * Hash function for deterministic seeding (Java-style hashCode)
 */
export function hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
}
