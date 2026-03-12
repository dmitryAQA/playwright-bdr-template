/**
 * BDR - Public API
 *
 * Main entry point for the BDR library.
 * Exports BDR steps, @Step decorator, and plugin configurations.
 */

import * as path from 'path';
import { BDRConfig, BDRPlugin } from './types';
import { BDR } from './bdr';
import { Step } from './decorators';

// Axiom is imported only as a type to prevent build errors if the folder is missing
import type { Axiom } from '../axiom';

// ============================================
// Global State (singleton pattern)
// ============================================

/**
 * Global Axiom instance (Stability Engine)
 */
let globalAxiom: Axiom | undefined;

/**
 * Global active plugins
 */
let globalPlugins: BDRPlugin[] = [];

/**
 * Base URL from Playwright config
 */
let globalBaseURL: string = '';

/**
 * Flag to track if config has been loaded
 */
let configLoaded = false;

// ============================================
// Auto-load Configuration
// ============================================

/**
 * Attempt to load playwright.config.ts to get baseURL
 */
function loadBaseURL(): void {
    const playwrightConfigPath = path.resolve('playwright.config.ts');

    try {
        // Clear require cache
        try {
            const cachedPath = require.resolve(playwrightConfigPath);
            delete require.cache[cachedPath];
        } catch (e) {
            // Not in cache
        }

        const configModule = require(playwrightConfigPath);
        const config = configModule.default || configModule;

        if (config?.use?.baseURL) {
            globalBaseURL = config.use.baseURL;
        }
    } catch (e) {
        // Couldn't load playwright config - that's fine
        // baseURL will be empty, only myDomains will be used
    }
}

/**
 * Attempt to load bdr.config.ts from project root.
 * Called automatically once when the module is imported.
 * Since each Playwright run is a new Node.js process, config is always fresh.
 */
async function loadConfigFile(): Promise<void> {
    if (configLoaded) return;

    // First load baseURL from playwright.config.ts
    loadBaseURL();

    const configPath = path.resolve('bdr.config.ts');

    try {
        // Clear require cache to force fresh import
        try {
            const cachedPath = require.resolve(configPath);
            delete require.cache[cachedPath];
        } catch (e) {
            // File not in require cache yet - that's fine
        }

        // Use require instead of import for TypeScript config files
        const configModule = require(configPath);
        const config = configModule.default;

        if (config) {
            configureBDR(config);
            configLoaded = true;
        }
    } catch (e) {
        // Config file doesn't exist or couldn't be loaded - that's fine
        // User can configure via configureBDR() directly
        configLoaded = true;
    }
}

// Auto-load config on module import (non-blocking)
loadConfigFile().catch(() => { });

// ============================================
// Public API Functions
// ============================================

/**
 * Get the global Axiom instance
 */
export function getAxiom(): Axiom | undefined {
    return globalAxiom;
}

/**
 * Get the global active plugins
 * Used internally by BDR steps and @Step decorator
 */
export function getPlugins(): BDRPlugin[] {
    return globalPlugins;
}

/**
 * Get the base URL from Playwright config
 * Used internally for domain detection
 */
export function getBaseURL(): string {
    return globalBaseURL;
}

/**
 * Configure BDR behavior
 *
 * @param config - Configuration object
 *
  * @example
  * ```typescript
  * import { Axiom } from 'bdr';
  * 
  * configureBDR({
  *   axiom: new Axiom({ retries: 5 })
  * });
  * ```
 */
export function configureBDR(config?: BDRConfig): void {
    if (!config) return;

    if (config.axiom) {
        globalAxiom = config.axiom;
    }

    if (config.plugins) {
        globalPlugins = config.plugins;
    }
}

/**
 * Reset BDR to default configuration
 * Useful for testing or re-initialization
 */
export function resetBDR(): void {
    globalPlugins = [];
    globalBaseURL = '';
}

/**
 * Define BDR configuration with type inference
 * Use this in bdr.config.ts for autocomplete and type checking
 */
export function defineBDRConfig(config: BDRConfig): BDRConfig {
    return config;
}

// ============================================
// Re-exports
// ============================================

export { BDR } from './bdr';
export { Step } from './decorators';
export { formatTitle } from './utils';

// We do NOT export Axiom directly as it might be missing in public builds
// It should be configured via defineBDRConfig or directly

// Type exports
export type {
    BDRConfig,
    BDRPlugin
} from './types';