// ============================================
// Plugin System Types
// ============================================

/**
 * Interface for all BDR Plugins
 */
export interface BDRPlugin {
    /** Unique name of the plugin */
    name: string;

    /**
     * Hook to wrap step execution with custom logic (e.g. retries).
     * The plugin must call `stepFn()` when ready to execute the step.
     */
    executeStep?: <T>(stepName: string, stepFn: () => Promise<T>) => Promise<T>;
}

// ============================================

import { Axiom } from '../axiom';

/**
 * BDR configuration for configureBDR()
 */
export interface BDRConfig {
    /** List of plugins to apply to BDR */
    plugins?: BDRPlugin[];

    /** Axiom stability engine instance */
    axiom?: Axiom;
}
