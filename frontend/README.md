# TurHR Frontend - HTML Version

Pure HTML/CSS/JavaScript frontend for the TurHR HR Management System.

## Structure

```
frontend/
├── index.html          # Main entry point
├── login.html          # Login/Signup page
├── dashboard.html      # Dashboard page
├── employees.html      # Employee management
├── payroll.html        # Payroll management
├── attendance.html     # Attendance tracking
├── projects.html       # Project management
├── messages.html       # Messaging system
├── css/
│   └── style.css       # Custom styles
└── js/
    ├── api.js          # API helper functions
    ├── auth.js         # Authentication functions
    ├── router.js       # Simple routing
    ├── components.js   # Shared components (sidebar, header)
    ├── modal.js        # Modal functions
    └── app.js          # Main app initialization
```

## Features

- ✅ Pure HTML/CSS/JavaScript (no build step)
- ✅ Tailwind CSS via CDN
- ✅ Chart.js for data visualization
- ✅ Responsive design
- ✅ Authentication & authorization
- ✅ All HR modules functional

## Setup

1. **No installation needed!** Just open `index.html` or serve via web server

2. **For development**, use a simple HTTP server:
   ```bash
   # Python
   python -m http.server 3000
   
   # Node.js
   npx http-server -p 3000
   
   # PHP
   php -S localhost:3000
   ```

3. **Configure API URL**:
   - Edit `js/api.js` and set `API_URL` to your backend URL
   - Or set `window.API_URL` before loading scripts

## Pages

- `/login.html` - Login and registration
- `/dashboard.html` - Main dashboard with stats
- `/employees.html` - Employee directory
- `/payroll.html` - Payroll management
- `/attendance.html` - Attendance tracking
- `/projects.html` - Project management
- `/messages.html` - Employee messaging

## API Configuration

The frontend connects to the backend API. Make sure:

1. Backend is running on `http://localhost:5000` (or update `API_URL` in `js/api.js`)
2. CORS is configured in backend to allow your frontend domain
3. MongoDB is connected

## Deployment

### Static Hosting (Vercel, Netlify, GitHub Pages)

1. Upload all files to hosting service
2. Set environment variable or update `API_URL` in `js/api.js` to point to your backend
3. Deploy!

### Example for Vercel:

1. Connect GitHub repo
2. Set build command: (none needed)
3. Set output directory: `frontend`
4. Add environment variable: `VITE_API_URL` (optional, or edit `js/api.js`)

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ JavaScript required
- No Internet Explorer support
