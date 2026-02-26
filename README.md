# Playwright BDR Template (TypeScript Reference Implementation)

> **"Minimum Magic, Maximum Control"** — The engineering standard for scaling test automation to 1000+ tests without Gherkin.

[![Live Demo](https://img.shields.io/badge/Live-Demo_Report-brightgreen)](https://dmitryaqa.github.io/playwright-bdr-template/)
[![Methodology](https://img.shields.io/badge/Read-Manifest-blue)](https://github.com/dmitryAQA/bdr-methodology)

This repository is the **Reference Implementation** of the [BDR Methodology](https://github.com/dmitryAQA/bdr-methodology) using **Playwright** and **TypeScript**. 

It demonstrates how to implement **Behavior-Driven Living Requirements** in code, generating beautiful reports without maintaining `.feature` files.

## Key Resources

- **BDR Methodology Manifesto**: The full theory, 4-layer architecture, anti-flakiness principles, and guides for other languages.
- **Live Allure Report**: See how the code below translates into "Living Documentation".

## Quick Start

### 1. Install dependencies
```bash
npm ci
npx playwright install
```

### 2. Run demonstration
```bash
# Run all BDR demo tests
npx playwright test tests/scaling_demo.spec.ts
```

### 3. View Report
```bash
# Generate and open Allure report
npx allure generate ./allure-results -o ./allure-report --clean
npx allure open ./allure-report
```

## Project Structure

This template strictly follows the BDR responsibility layers:

| Directory | Layer | Description |
| :--- | :--- | :--- |
| **`tests/`** | **Level 3 (Spec)** | The entry point. Pure business intent. Reads like a story. |
| **`src/flows/`** | **Level 2 (Domain)** | Business Logic. Creating users, adding items to cart. Reusable components. |
| **`src/pom/`** | **Level 1 (Page)** | Page Objects. Selectors and raw Playwright interactions. |
| **`src/bdr/`** | **Core** | Utilities for Reporting, Tables, and Decorators. **Do not modify.** |

## Contributing

This repository is for the **TypeScript** implementation.

If you are looking for **Python**, **Java**, or **C#** examples, please check the [Community Implementations](https://github.com/dmitryAQA/bdr-methodology#community-implementations) section in the main methodology repository.
