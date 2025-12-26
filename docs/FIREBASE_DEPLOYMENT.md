# Firebase Hosting Deployment Guide

This guide will help you deploy your portfolio frontend to Firebase Hosting.

## 📋 Prerequisites

1. **Firebase Account**: Sign up at [firebase.google.com](https://firebase.google.com)
2. **Firebase CLI**: Install globally with `npm install -g firebase-tools`
3. **Backend Server**: Your Express backend needs to be hosted separately (see Backend Hosting Options below)

## 🚀 Step-by-Step Deployment

### 1. Install Firebase CLI (if not already installed)
```bash
npm install -g firebase-tools
```

### 2. Login to Firebase
```bash
firebase login
```

### 3. Initialize Firebase (if needed)
```bash
firebase init hosting
```
- Select your Firebase project (or create a new one)
- Set public directory to: `client/build`
- Configure as single-page app: **Yes**
- Set up automatic builds: **No** (we'll build manually)

### 4. Build Your React App
```bash
cd client
npm run build
cd ..
```

### 5. Configure Backend API URL

Before deploying, you need to set your backend API URL. Create a `.env.production` file in the `client` folder:

```bash
cd client
```

Create `.env.production`:
```env
REACT_APP_API_URL=https://your-backend-url.com
```

**Important**: Replace `https://your-backend-url.com` with your actual backend server URL (without `/api` at the end).

Then rebuild:
```bash
npm run build
cd ..
```

### 6. Deploy to Firebase
```bash
firebase deploy --only hosting
```

Your site will be live at: `https://your-project-id.web.app` or `https://your-project-id.firebaseapp.com`

## 🔧 Backend Hosting Options

Since Firebase Hosting only serves static files, you need to host your Express backend separately. Here are popular options:

### Option 1: Render (Recommended - Free tier available)
1. Go to [render.com](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repository
4. Set:
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Environment Variables**: Add your `.env` variables
5. Your backend will be available at: `https://your-app.onrender.com`

### Option 2: Railway
1. Go to [railway.app](https://railway.app)
2. Create a new project from GitHub
3. Select your server folder
4. Add environment variables
5. Deploy

### Option 3: Heroku
1. Install Heroku CLI
2. `cd server`
3. `heroku create your-app-name`
4. `git push heroku main`
5. Set environment variables in Heroku dashboard

### Option 4: DigitalOcean / AWS / Google Cloud
- Use their App Platform or similar services
- Configure to run Node.js applications

## 🔄 Updating Your Backend CORS Settings

Make sure your backend allows requests from your Firebase Hosting domain. Update `server/src/app.js`:

```javascript
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://your-project-id.web.app',
    'https://your-project-id.firebaseapp.com'
  ],
  credentials: true,
};
```

## 📝 Environment Variables Setup

### Frontend (`.env.production` in `client/` folder)
```env
REACT_APP_API_URL=https://your-backend-url.com
```

### Backend (Set in your hosting platform)
- `PORT` (usually auto-set by hosting platform)
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRE`
- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_FROM`
- `CLIENT_URL` (your Firebase Hosting URL)

## 🔄 Continuous Deployment

### Option 1: Manual Deployment
```bash
cd client
npm run build
cd ..
firebase deploy --only hosting
```

### Option 2: GitHub Actions (Automated)
Create `.github/workflows/firebase-deploy.yml`:
```yaml
name: Deploy to Firebase
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: cd client && npm install && npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          projectId: your-project-id
```

## 🐛 Troubleshooting

### API requests failing
- Check that `REACT_APP_API_URL` is set correctly
- Verify backend CORS settings include your Firebase domain
- Check browser console for CORS errors

### Images not loading
- Ensure backend serves images with correct CORS headers
- Check image URLs in database are absolute URLs

### 404 errors on refresh
- Firebase Hosting is configured with rewrites to handle SPA routing
- Verify `firebase.json` has the rewrite rule for `**` → `/index.html`

## 📚 Additional Resources

- [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)
- [React Environment Variables](https://create-react-app.dev/docs/adding-custom-environment-variables/)

