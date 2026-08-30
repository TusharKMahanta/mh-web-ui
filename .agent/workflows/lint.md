---
description: Run linting and type checking
---

# Lint and Type Check

This workflow runs ESLint and TypeScript type checking on the codebase.

## Steps

// turbo
1. **Run ESLint**
   ```bash
   npm run lint
   ```

// turbo
2. **Run TypeScript type checking**
   ```bash
   npm run typecheck
   ```

## Fix Linting Issues

To automatically fix linting issues:
```bash
npx eslint --fix --ignore-path .gitignore --cache --cache-location ./node_modules/.cache/eslint .
```

## Configuration Files

- ESLint: `.eslintrc.cjs`
- TypeScript: `tsconfig.json`
