# CloudFlare Pages Deployment Configuration for BadgerCite

## Project Information
- **Project Name**: badgercite
- **GitHub Repository**: abobilly/badgercite
- **Domain**: badgercite.com
- **CloudFlare Zone and Admin Codes**: Saved universally

## Build Settings Configuration

### Framework Preset
**Select**: `Create React App`
- This is a React application using Create React App (react-scripts 5.0.1)
- The client is built with TypeScript, React 18, and Material-UI

### Build Command
```bash
cd client && npm ci && npm run build
```
**Alternative (if npm ci fails)**:
```bash
cd client && npm install && npm run build
```

### Build Output Directory
```
client/build
```

### Root Directory
```
/
```
*Leave as root since we need to access both server and client directories*

### Environment Variables
Set these in CloudFlare Pages environment variables:
- `NODE_ENV=production`
- `REACT_APP_API_URL=https://api.badgercite.com` *(or your backend URL)*
- `PORT=3000` *(for local development reference)*

## Project Structure Notes
```
badgercite/
├── client/          # React frontend (TypeScript + Material-UI)
│   ├── public/
│   ├── src/
│   ├── package.json # Contains "build": "react-scripts build"
│   └── build/       # Generated after build (deployment target)
├── server/          # Node.js/Express backend
│   ├── index.js
│   └── ...
└── package.json     # Root package with build script
```

## Deployment Flow
1. CloudFlare Pages will run the build command in the repository root
2. The build command navigates to `client/` directory
3. Installs React dependencies
4. Runs `react-scripts build` to create optimized production build
5. Static files are generated in `client/build/`
6. CloudFlare serves these static files from the build output directory

## Backend Considerations
- The Express server (`server/`) is NOT deployed to CloudFlare Pages
- You'll need separate hosting for the backend API (e.g., Railway, Heroku, or CloudFlare Workers)
- Update `REACT_APP_API_URL` environment variable to point to your backend URL

## Post-Deployment Setup
1. Configure custom domain: badgercite.com
2. Set up SSL certificate (automatic with CloudFlare)
3. Configure DNS records to point to CloudFlare Pages
4. Test all client-side routes work with CloudFlare's SPA routing

---
*Generated for future agent reference - contains all necessary CloudFlare Pages deployment configuration*