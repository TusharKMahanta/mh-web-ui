---
description: Run tests (placeholder for future test setup)
---

# Run Tests

This workflow is a placeholder for running tests. The project doesn't currently have a test framework configured.

## Recommended Test Setup

For a Remix application, consider adding:

1. **Vitest** for unit testing
   ```bash
   npm install -D vitest @testing-library/react @testing-library/jest-dom
   ```

2. **Playwright** or **Cypress** for E2E testing
   ```bash
   npm install -D @playwright/test
   ```

## Future Steps

Once tests are configured, add test scripts to `package.json`:

```json
{
  "scripts": {
    "test": "vitest",
    "test:e2e": "playwright test"
  }
}
```

Then you can run tests with:
```bash
npm test
```
