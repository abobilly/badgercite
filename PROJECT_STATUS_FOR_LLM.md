# BadgerCite Project - Complete LLM Context & Status

## SYSTEM STATUS: ✅ FULLY OPERATIONAL

**Live URLs:**
- Frontend: https://badgercite.com (CloudFlare Pages)
- Backend API: https://badgercite-production.up.railway.app (Railway)
- Health Check: https://badgercite-production.up.railway.app/health

**Repository:** `abobilly/badgercite` (GitHub)
**Current Branch:** `main`
**Last Updated:** September 27, 2025

---

## CRITICAL DEPLOYMENT CONFIGURATION

### DO NOT CHANGE THESE (Will Break Deployment):
1. **NO package-lock.json files** - Intentionally gitignored, causes Railway conflicts
2. **Express routes use `/*` not `*`** - Express 5.x compatibility requirement
3. **CORS origins:** `badgercite.com`, `www.badgercite.com` - Required for frontend-backend communication
4. **Railway config:** `server/railway.json` - Uses `npm install --omit=dev`

### Key Files & Configurations:

**server/railway.json:**
```json
{
  "build": {
    "buildCommand": "npm install --omit=dev",
    "environment": { "NODE_ENV": "production" }
  },
  "deploy": {
    "startCommand": "node index.js",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 180,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 3
  }
}
```

**wrangler.toml:**
```toml
name = "badgercite"
compatibility_date = "2025-09-26"
pages_build_output_dir = "client/build"
```

**server/package.json dependencies:**
```json
{
  "compression": "^1.8.1",
  "cors": "^2.8.5", 
  "dotenv": "^17.2.2",
  "express": "^5.1.0",
  "helmet": "^8.1.0",
  "mise": "^3.0.0",
  "morgan": "^1.10.1",
  "rate-limiter-flexible": "^8.0.1",
  "winston": "^3.17.0"
}
```

---

## PROJECT STRUCTURE

```
badgercite/
├── client/                    # React frontend (deployed to CloudFlare Pages)
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/           # Page components
│   │   └── utils/           # Frontend utilities
│   ├── public/              # Static assets
│   ├── package.json         # Frontend dependencies
│   └── build/               # Built assets (auto-generated)
├── server/                   # Node.js/Express backend (deployed to Railway)
│   ├── index.js             # Main server file
│   ├── package.json         # Backend dependencies (NO LOCK FILE)
│   ├── railway.json         # Railway deployment configuration
│   ├── routes/
│   │   ├── health.js        # Health check endpoints
│   │   └── citation.js      # Citation processing (NEEDS IMPLEMENTATION)
│   ├── middleware/          # Express middleware
│   ├── services/           # Business logic services
│   └── utils/
│       └── logger.js       # Winston logging configuration
├── wrangler.toml           # CloudFlare Pages configuration
├── .gitignore              # Excludes package-lock.json files
├── RAILWAY_CONFIG.md       # Railway environment variables
└── PROJECT_STATUS_FOR_LLM.md # This file
```

---

## RAILWAY ENVIRONMENT VARIABLES

```bash
RAILWAY_PROJECT_NAME=adventurous-reprieve
RAILWAY_PUBLIC_DOMAIN=badgercite-production.up.railway.app
RAILWAY_SERVICE_ID=badgercite
RAILWAY_ENVIRONMENT_ID=a18e417b-991c-40a2-93ba-56f113222be9
RAILWAY_PROJECT_ID=b5b2c1f0-b197-403a-b3b5-e561aeaba0f2
RAILWAY_ENVIRONMENT_NAME=production
RAILWAY_SERVICE_NAME=badgercite
RAILWAY_PRIVATE_DOMAIN=badgercite.railway.internal
```

---

## TECHNICAL ARCHITECTURE

### Deployment Flow:
1. **Code Push** → GitHub receives changes
2. **Auto-Deploy** → Railway rebuilds backend, CloudFlare rebuilds frontend
3. **Health Check** → Railway verifies `/health` endpoint before switching traffic
4. **Zero Downtime** → New deployment goes live only after health check passes

### Request Flow:
1. **User** → `badgercite.com` (CloudFlare Pages serves React app)
2. **React App** → Makes API calls to `badgercite-production.up.railway.app`
3. **CORS Validation** → Railway allows requests from `badgercite.com`
4. **API Response** → Railway processes and returns data

### Security & Performance:
- **Helmet** security headers
- **Rate limiting** via rate-limiter-flexible
- **Compression** middleware for response optimization
- **Winston** logging for debugging
- **CORS** properly configured for production

---

## CURRENT IMPLEMENTATION STATUS

### ✅ COMPLETED:
- **Infrastructure:** Railway + CloudFlare Pages deployment
- **Auto-deployment:** GitHub integration working
- **Health monitoring:** Railway health checks active
- **CORS:** Frontend-backend communication enabled
- **Security:** Basic middleware implemented
- **Logging:** Winston logger configured
- **Error handling:** Basic error middleware
- **Static serving:** React app served in production

### 🚧 NEEDS IMPLEMENTATION (Priority Order):

#### 1. CITATION PROCESSING LOGIC (HIGH PRIORITY)
**File:** `server/routes/citation.js`
**Current Status:** Basic route structure, no implementation
**Needs:**
- Bluebook citation formatting algorithms
- Legal case parsing logic
- Citation validation
- Multiple citation style support

#### 2. FRONTEND CITATION INTERFACE (HIGH PRIORITY)  
**Files:** `client/src/components/`, `client/src/pages/`
**Current Status:** Basic React app, no citation-specific UI
**Needs:**
- Citation input forms
- Real-time preview components
- Citation style selectors
- Export functionality UI

#### 3. DATABASE INTEGRATION (MEDIUM PRIORITY)
**Current Status:** No database connected
**Options:** Railway PostgreSQL, Supabase, PlanetScale
**Needs:**
- Legal case database schema
- Citation template storage
- User data persistence (if auth added)

#### 4. AUTHENTICATION (MEDIUM PRIORITY)
**Current Status:** No auth system
**Recommendations:** Auth0, Clerk, Firebase Auth
**Impact:** Will require CORS updates, middleware changes

#### 5. ADVANCED FEATURES (LOW PRIORITY)
- PDF/Word export
- Citation management dashboard
- Collaboration features
- Advanced search capabilities

---

## DEVELOPMENT COMMANDS

### Local Development:
```bash
# Backend (from server/)
npm install
npm run dev

# Frontend (from client/)  
npm install --legacy-peer-deps
npm start

# Build frontend
npm run build
```

### Deployment:
```bash
# Auto-deploy (recommended)
git add .
git commit -m "Description"
git push

# Manual CloudFlare deploy
npx wrangler pages deploy
```

### Testing:
```bash
# Health checks
curl https://badgercite-production.up.railway.app/health
curl https://badgercite-production.up.railway.app/api/health/detailed

# Frontend
https://badgercite.com
```

---

## TROUBLESHOOTING GUIDE

### Railway Deployment Issues:
1. **Build fails:** Check `server/railway.json` syntax
2. **Package conflicts:** Ensure no `package-lock.json` in server/
3. **Health check fails:** Verify `/health` endpoint responds with 200
4. **Express errors:** Check wildcard routes use `/*` not `*`

### CloudFlare Deployment Issues:
1. **Build fails:** Check `wrangler.toml` configuration
2. **Assets not found:** Verify `client/build/` directory exists
3. **Config conflicts:** Don't mix `main` and `pages_build_output_dir`

### CORS Issues:
1. **API calls blocked:** Check CORS origins in `server/index.js`
2. **Domain mismatch:** Verify frontend domain in allowed origins
3. **Protocol issues:** Ensure both HTTP/HTTPS handled

### Performance Issues:
1. **Slow API:** Check Railway logs and metrics
2. **Frontend slow:** Optimize React bundle size
3. **Database slow:** Add indexing and caching

---

## LEGAL CITATION CONTEXT

### Bluebook Format:
- Standard legal citation format in US
- Complex rules for different source types
- Requires precise formatting and punctuation

### Source Types to Support:
- Court cases (federal, state, appellate)
- Statutes and codes
- Law review articles
- Legal treatises
- Constitutional provisions

### Citation Components:
- Case names and parties
- Court and jurisdiction
- Date and year
- Reporter volume and page
- Pinpoint citations

---

## NEXT LLM INSTRUCTIONS

### Start by Testing:
1. Visit https://badgercite.com - verify frontend loads
2. Check https://badgercite-production.up.railway.app/health - verify backend responds
3. Open browser dev tools, check for API connection errors

### Focus Areas (in order):
1. **Implement citation processing logic** in `server/routes/citation.js`
2. **Build citation input forms** in React frontend
3. **Add legal citation formatting algorithms**
4. **Connect to legal database or API**

### Key Files to Examine:
- `server/routes/citation.js` - Citation API endpoints
- `client/src/App.js` - Main React component
- `server/index.js` - Express server configuration
- Existing JSON files with citation data (T1.json, T6-T9.json, etc.)

### Development Approach:
1. **Start with basic citation input/output**
2. **Add one citation type at a time** (start with court cases)
3. **Test each feature thoroughly** before moving to next
4. **Use existing citation data files** as reference

### Success Criteria:
- User can input raw legal text
- System formats according to Bluebook rules
- Output is properly formatted citation
- Multiple citation styles supported
- Export functionality works

**REMEMBER:** Infrastructure is solid. Focus on the legal citation logic - that's the core value proposition!