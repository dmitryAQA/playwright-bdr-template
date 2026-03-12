/**
 * BDR Anti-Flaky Configuration
 * 
 * This file configures the BDR (Behavior-Driven Retry) system.
 * Place this file in your project root, next to playwright.config.ts
 */

import { defineBDRConfig } from './src/bdr';

// Axiom engine can be imported locally for smart retries:
// import { Axiom } from './src/bdr';

export default defineBDRConfig({
    /**
     * Axiom (Stability Engine) - Experimental
     * Unfinished implementation, hidden from public build.
     * To enable locally, uncomment the import above and the axiom property below.
     */
    /*
    axiom: new Axiom({
      retries: 2,
      retryDelay: 500,
      hints: {
        enabled: true,
        showTeaser: true,
        showDocumentation: true,
      },
      history: {
        threshold: 3,
        retentionDays: 14,
        historyRules: {
          maxIncidentsPerDay: 1,
          minHoursBetween: 12
        },
        displayMode: 'error_message',
        trackingMode: 'FATAL'
      }
    })
    */
});