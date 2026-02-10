/**
 * Format a step title by interpolating arguments.
 * Supports {0}, {1} index-based replacement.
 * Supports {} sequential replacement.
 */
export function formatTitle(template: string, args: any[]): string {
    let argIndex = 0;
    return template.replace(/{(\d+|[\w.]*)}/g, (match, key) => {
        // 1. Empty placeholder {} - sequential replacement
        if (key === '') {
            if (argIndex < args.length) {
                return String(args[argIndex++]); // Increment index for next {}
            }
            return match;
        }

        // 2. Index-based replacement: {0}, {1}
        if (/^\d+$/.test(key)) {
            const index = parseInt(key, 10);
            if (index >= 0 && index < args.length) {
                return String(args[index]);
            }
            return match;
        }

        // 3. Fallback
        return match;
    });
}
