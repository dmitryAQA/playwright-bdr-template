import playwright from "eslint-plugin-playwright";
import tsParser from "@typescript-eslint/parser";

export default [
    playwright.configs["flat/recommended"],
    {
        files: ["tests/**/*.ts", "src/**/*.ts"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: false,
            }
        },
        rules: {
            "playwright/expect-expect": "off",
            "playwright/no-networkidle": "error",
            "playwright/no-wait-for-timeout": "error",
            "playwright/no-element-handle": "error",
            "playwright/no-eval": "error",
            "playwright/no-force-option": "error",
        }
    },
    {
        files: ["tests/**/*.ts", "src/**/*.ts"],
        rules: {
            "no-restricted-imports": ["error", {
                paths: [{
                    name: "@faker-js/faker",
                    message: "Don't use native Faker. Use the seeded 'faker' fixture from src/fixtures/index.ts to ensure deterministic tests."
                }]
            }]
        }
    },
    {
        files: ["src/pom/**/*.ts"],
        rules: {
            // Rule #9: Stateless POM Enforcement
            // Banning class properties (except 'page') to prevent state leakage between tests
            "no-restricted-syntax": ["error",
                {
                    "selector": "PropertyDefinition:not([key.name='page'])",
                    "message": "POM must be stateless. Don't store data in properties. Use method arguments instead."
                }
            ]
        }
    },
    {
        files: ["src/flows/**/*.ts"],
        rules: {
            // Rule #10: BDR Flow Enforcement
            // Every public method in a Flow class must have a @Step decorator
            "no-restricted-syntax": ["error",
                {
                    "selector": "MethodDefinition[kind='method'][accessibility!='private']:not(:has(Decorator[expression.callee.name='Step']))",
                    "message": "All public Flow methods must be decorated with @Step for BDR reporting."
                },
                {
                    "selector": "NewExpression[callee.name=/.*Page$/]",
                    "message": "Don't use 'new' for Page Objects. Use fixtures from src/fixtures/index.ts instead."
                },
                {
                    "selector": "NewExpression[callee.name=/.*Flow$/]",
                    "message": "Don't use 'new' for Flows. Use fixtures from src/fixtures/index.ts instead."
                }
            ]
        }
    },
    {
        files: ["tests/**/*.ts"],
        rules: {
            // Lead Standard: Test Architectural Guardrails
            "no-restricted-syntax": ["error",
                {
                    "selector": "NewExpression[callee.name=/.*Page$/]",
                    "message": "Don't use 'new' for Page Objects. Use fixtures from src/fixtures/index.ts instead."
                },
                {
                    "selector": "NewExpression[callee.name=/.*Flow$/]",
                    "message": "Don't use 'new' for Flows. Use fixtures from src/fixtures/index.ts instead."
                }
            ]
        }
    }
];
