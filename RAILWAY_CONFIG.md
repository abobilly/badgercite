# Railway Configuration Notes

## Current Railway Setup

**Project:** `adventurous-reprieve`  
**Domain:** `badgercite-production.up.railway.app`  
**Environment:** `production`  
**Service:** `badgercite`

### Railway Environment Variables
- `RAILWAY_PROJECT_NAME`: adventurous-reprieve
- `RAILWAY_PUBLIC_DOMAIN`: badgercite-production.up.railway.app
- `RAILWAY_SERVICE_ID`: badgercite
- `RAILWAY_ENVIRONMENT_ID`: a18e417b-991c-40a2-93ba-56f113222be9
- `RAILWAY_PROJECT_ID`: b5b2c1f0-b197-403a-b3b5-e561aeaba0f2
- `RAILWAY_ENVIRONMENT_NAME`: production
- `RAILWAY_SERVICE_NAME`: badgercite
- `RAILWAY_PRIVATE_DOMAIN`: badgercite.railway.internal

### Configuration File Location
**Important:** The Railway configuration file is located at:
```
server/railway.json
```

### Current Configuration
```json
{
  "build": {
    "buildCommand": "npm install --omit=dev",
    "environment": {
      "NODE_ENV": "production"
    }
  },
  "deploy": {
    "startCommand": "node index.js",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 300
  }
}
```

### Notes
- All other Railway variables were deleted for clean setup
- Using `npm install --omit=dev` instead of `npm ci` to avoid package-lock.json issues
- Server runs on Railway at `badgercite-production.up.railway.app`
- Frontend on CloudFlare Pages at `badgercite.com` calls this Railway API