---
description: Build the application for production
---

# Build for Production

This workflow builds the Remix application for production deployment.

## Steps

1. **Clean previous build** (optional)
   ```bash
   rm -rf build
   ```

// turbo
2. **Build the application**
   ```bash
   npm run build
   ```

3. **Verify build output**
   ```bash
   ls -la build/
   ```

## Build Output

The build process creates:
- `build/server/` - Server-side code
- `build/client/` - Client-side assets

## Next Steps

After building:
- Test locally with `/start`
- Deploy with Docker using `/docker`
- Deploy to your hosting platform
