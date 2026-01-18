# Deployment Guide - TurHR

## Understanding the Errors

### Browser Extension Errors (Can Ignore)
- `utils.js`, `extensionState.js`, `heuristicsRedefinitions.js` errors
- These are from browser extensions (ad blockers, password managers, etc.)
- **They do NOT affect your application** - you can safely ignore them

### CORS Error (Needs Fix)
- Error: "Access to XMLHttpRequest at 'http://localhost:5000' from origin 'https://hr-8g3n.vercel.app'"
- **Problem**: Frontend on Vercel trying to connect to localhost backend
- **Solution**: Deploy backend to cloud OR update API URL

## Solution Options

### Option 1: Deploy Backend to Cloud (Recommended)

#### Using Railway (Easiest)
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your backend folder
5. Add environment variables:
   - `MONGODB_URI` (your MongoDB Atlas connection)
   - `JWT_SECRET`
   - `CLIENT_URL=https://hr-8g3n.vercel.app`
   - `EMAIL_HOST`, `EMAIL_USER`, `EMAIL_PASS` (if using email)
6. Railway will give you a URL like: `https://your-app.railway.app`
7. Update frontend API URL (see below)

#### Using Render
1. Go to https://render.com
2. Create new "Web Service"
3. Connect GitHub repo
4. Root Directory: `backend`
5. Build Command: `npm install`
6. Start Command: `npm start`
7. Add environment variables
8. Get your URL: `https://your-app.onrender.com`

#### Using Heroku
1. Install Heroku CLI
2. `cd backend`
3. `heroku create your-app-name`
4. `heroku config:set MONGODB_URI=... JWT_SECRET=... CLIENT_URL=...`
5. `git push heroku main`

### Option 2: Update Frontend API URL

After deploying backend, update Vercel environment variables:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add:
   ```
   VITE_API_URL=https://your-backend-url.railway.app/api
   ```
3. Redeploy frontend

### Option 3: Use Vercel Serverless Functions (Advanced)

Convert backend to Vercel serverless functions (requires code restructuring)

## Current Setup

### Backend CORS Configuration
✅ Updated to allow:
- `http://localhost:3000` (local dev)
- `https://hr-8g3n.vercel.app` (your Vercel deployment)
- Any origin in `CLIENT_URL` env variable

### Frontend API Configuration
The frontend uses: `import.meta.env.VITE_API_URL || 'http://localhost:5000/api'`

## Quick Fix for Testing

### Temporary: Use ngrok to expose localhost
1. Install ngrok: https://ngrok.com
2. Run: `ngrok http 5000`
3. Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)
4. Update Vercel env: `VITE_API_URL=https://abc123.ngrok.io/api`
5. Update backend `.env`: `CLIENT_URL=https://hr-8g3n.vercel.app`

**Note**: ngrok free tier has limitations. Use for testing only.

## Production Checklist

- [ ] Deploy backend to cloud (Railway/Render/Heroku)
- [ ] Set `VITE_API_URL` in Vercel environment variables
- [ ] Update `CLIENT_URL` in backend environment variables
- [ ] Test API connection from deployed frontend
- [ ] Configure email service (if using invitations)
- [ ] Set up domain (optional)
- [ ] Enable HTTPS (automatic with cloud providers)

## Environment Variables Needed

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret
JWT_EXPIRE=30d
NODE_ENV=production
CLIENT_URL=https://hr-8g3n.vercel.app
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Frontend (Vercel Environment Variables)
```env
VITE_API_URL=https://your-backend-url.railway.app/api
```

## Testing After Deployment

1. Visit: https://hr-8g3n.vercel.app
2. Try to register/login
3. Check browser console for errors
4. Verify API calls work (Network tab in DevTools)

## Need Help?

- Check backend logs in Railway/Render dashboard
- Check Vercel deployment logs
- Verify environment variables are set correctly
- Test API endpoint directly: `https://your-backend-url/api/auth/me`
