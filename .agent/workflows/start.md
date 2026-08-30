---
description: Start the production server
---

# Start Production Server

This workflow starts the Remix application in production mode.

## Prerequisites

- Application must be built first (run `/build`)

## Steps

// turbo
1. **Start the production server**
   ```bash
   npm run start
   ```

The production server will start on `http://localhost:3000` by default.

## Environment Variables

You can customize the port:
```bash
PORT=8080 npm run start
```

## Stopping the Server

Press `Ctrl+C` in the terminal to stop the production server.
