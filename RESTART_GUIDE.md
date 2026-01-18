# TurHR - Restart Guide

## About Those Browser Extension Errors

The errors you're seeing:
- `utils.js:1 Failed to load resource: net::ERR_FILE_NOT_FOUND`
- `extensionState.js:1 Failed to load resource: net::ERR_FILE_NOT_FOUND`
- `heuristicsRedefinitions.js:1 Failed to load resource: net::ERR_FILE_NOT_FOUND`

**These are NOT errors from the TurHR application.** These are from browser extensions (like ad blockers, password managers, or other browser add-ons) trying to load resources and failing. You can safely ignore them - they don't affect the functionality of the HR system.

## Server Status

Both servers should now be running:
- **Backend**: http://localhost:5000 (MongoDB connected to Atlas)
- **Frontend**: http://localhost:3000

## How to Restart Everything

If you need to restart the servers manually:

### Stop All Servers
```powershell
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
```

### Start Backend
```powershell
cd backend
npm run dev
```

### Start Frontend (in a new terminal)
```powershell
cd frontend
npm run dev
```

## Access the Application

Open your browser and go to: **http://localhost:3000**

The application should load the login page. You can register a new account to get started!
