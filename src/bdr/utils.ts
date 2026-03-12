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

        // 2. Index-based or property-based replacement: {0}, {0.name}
        const parts = key.split('.');
        const index = parseInt(parts[0], 10);

        if (!isNaN(index) && index >= 0 && index < args.length) {
            let value = args[index];

            // Navigate nested properties if provided (e.g., {0.user.name})
            for (let i = 1; i < parts.length; i++) {
                if (value && typeof value === 'object') {
                    value = value[parts[i]];
                } else {
                    return match; // Fallback if property doesn't exist
                }
            }

            return value !== undefined ? String(value) : match;
        }

        // 3. Fallback
        return match;
    });
}
