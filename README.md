# TurHR - HR Management System

A comprehensive HR Management System with **HTML frontend** and **Node.js/Express backend**.

## Tech Stack

- **Frontend**: Pure HTML, CSS, JavaScript (Tailwind CSS via CDN)
- **Backend**: Node.js, Express.js, MongoDB
- **No Build Step Required**: Just open HTML files or use a simple HTTP server

## Features

✅ **Multi-level UI** with role-based navigation  
✅ **RBAC (Role-Based Access Control)** - 5 role levels  
✅ **Payroll Management** - Complete payroll processing  
✅ **Staff Management** - Employee directory with search/filter  
✅ **Attendance Tracking** - Check-in/out system  
✅ **Project Assignment** - Project management  
✅ **Employee Communication** - Real-time messaging  
✅ **Modern Dashboard** - Analytics and charts  
✅ **Email Invitations** - Professional invitation system  

## Quick Start

### Backend Setup

```bash
cd backend
npm install
# Create .env file (see backend/.env.example)
npm run dev
```

Backend runs on: `http://localhost:5000`

### Frontend Setup

**Option 1: Simple HTTP Server (Recommended)**
```bash
cd frontend
npm install
npm run serve
```

**Option 2: Python**
```bash
cd frontend
python -m http.server 3000
```

**Option 3: PHP**
```bash
cd frontend
php -S localhost:3000
```

**Option 4: Just Open Files**
- Open `frontend/login.html` in your browser
- Update `js/api.js` to set correct `API_URL`

Frontend runs on: `http://localhost:3000`

## Project Structure

```
HRSys/
├── backend/           # Node.js/Express API
│   ├── models/        # MongoDB models
│   ├── routes/        # API routes
│   ├── controllers/   # Business logic
│   └── middleware/    # Auth & validation
├── frontend/          # HTML/CSS/JS
│   ├── *.html        # Page files
│   ├── css/          # Styles
│   └── js/           # JavaScript modules
└── README.md
```

## Pages

- `/login.html` - Login and registration
- `/dashboard.html` - Main dashboard
- `/employees.html` - Employee management
- `/payroll.html` - Payroll management
- `/attendance.html` - Attendance tracking
- `/projects.html` - Project management
- `/messages.html` - Employee messaging

## Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:3000
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Frontend
Edit `frontend/js/api.js` and set:
```javascript
const API_URL = 'http://localhost:5000/api';
// Or your deployed backend URL
```

## Default Roles

- **super_admin**: Full system access
- **admin**: Employee and payroll management
- **hr_manager**: HR functions and payroll
- **manager**: Team management
- **employee**: View own data

## API Endpoints

- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `GET /api/employees` - Get employees
- `GET /api/payroll` - Get payroll records
- `GET /api/attendance` - Get attendance
- `GET /api/projects` - Get projects
- `POST /api/invitations` - Send invitation
- `GET /api/dashboard/stats` - Dashboard statistics

## Deployment

### Backend
Deploy to Railway, Render, or Heroku. See `DEPLOYMENT_GUIDE.md`

### Frontend
Upload to any static hosting:
- Vercel
- Netlify
- GitHub Pages
- Any web server

Just update `API_URL` in `js/api.js` to point to your deployed backend.

## License

MIT License
