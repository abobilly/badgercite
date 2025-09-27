# Railway Configuration Override Instructions

## Dashboard Settings (CRITICAL - Set these in Railway Dashboard):

### 1. Source Configuration
- **Root Directory**: `/server` (NOT `/`)
- **Branch**: `main`
- **Wait for CI**: OFF

### 2. Build Configuration
- **Builder**: RAILPACK (NOT Nixpacks)
- **Build Command**: `npm ci --omit=dev`
- **Watch Paths**: `server/**`

### 3. Deploy Configuration  
- **Start Command**: `node index.js`
- **Healthcheck Path**: `/health`
- **Healthcheck Timeout**: 300

## Environment Variables (Set in Railway Dashboard):

```bash
# Force Railway to use correct settings
NODE_ENV=production
RAILWAY_BUILD_ROOT=server
RAILWAY_BUILD_COMMAND=npm ci --omit=dev
RAILWAY_START_COMMAND=node index.js

# Force Railpack (override Nixpacks)
RAILPACK_BUILD_CMD=npm ci --omit=dev
RAILPACK_START_CMD=node index.js

# Disable deprecated npm flags
NPM_CONFIG_PRODUCTION=false
NPM_CONFIG_OMIT=dev
```

## File Locations:
- Main config: `/server/railway.toml` (already exists)
- Root override: `/railway.toml` (set builder=RAILPACK)

## Railway.toml Files:

### Root `/railway.toml`:
```toml
[build]
  builder = "RAILPACK"

[deploy]
  startCommand = "node server/index.js"
```

### Server `/server/railway.toml`:
```toml
[build]
  buildCommand = "npm ci --omit=dev"
  
[deploy]
  startCommand = "node index.js"
  healthcheckPath = "/health"
  healthcheckTimeout = 300

[build.environment]
  NODE_ENV = "production"
```

## Troubleshooting Commands:

1. Clear Railway cache: Delete and recreate service
2. Force rebuild: `railway up --detach`
3. Check logs: `railway logs --tail 50`

## Key Points:
- Set Root Directory to `/server` in dashboard
- Use RAILPACK builder, NOT Nixpacks
- Use `--omit=dev` instead of `--production`
- Ensure package.json and package-lock.json are synced