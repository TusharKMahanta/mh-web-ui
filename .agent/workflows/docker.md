---
description: Build and run the application with Docker
---

# Docker Deployment

This workflow builds and runs the Morhaat Web UI application using Docker.

## Prerequisites

- Docker installed and running
- Docker daemon accessible

## Steps

1. **Build the Docker image**
   ```bash
   docker build -t morhaat-web-ui:latest .
   ```

2. **Run the container**
   ```bash
   docker run -p 3000:3000 --name morhaat-web-ui morhaat-web-ui:latest
   ```

3. **Access the application**
   
   Open your browser to `http://localhost:3000`

## Additional Commands

**Run in detached mode:**
```bash
docker run -d -p 3000:3000 --name morhaat-web-ui morhaat-web-ui:latest
```

**View logs:**
```bash
docker logs morhaat-web-ui
```

**Stop the container:**
```bash
docker stop morhaat-web-ui
```

**Remove the container:**
```bash
docker rm morhaat-web-ui
```

**Custom port mapping:**
```bash
docker run -p 8080:3000 --name morhaat-web-ui morhaat-web-ui:latest
```

## Docker Compose (Optional)

Create a `docker-compose.yml` file for easier management:

```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

Then run:
```bash
docker-compose up -d
```
