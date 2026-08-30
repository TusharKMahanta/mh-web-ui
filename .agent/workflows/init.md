---
description: Initialize and set up the development environment
---

# Initialize Development Environment

This workflow sets up the development environment for the Morhaat Web UI application.

## Prerequisites

- Node.js >= 20.0.0
- npm (comes with Node.js)

## Steps

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Verify installation**
   ```bash
   npm list --depth=0
   ```

3. **Run type checking**
   ```bash
   npm run typecheck
   ```

4. **Run linting**
   ```bash
   npm run lint
   ```

## Next Steps

After initialization, you can:
- Run the development server with `/dev`
- Build for production with `/build`
- Run the production server with `/start`
- Deploy with Docker using `/docker`
