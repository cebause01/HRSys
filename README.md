# TurHR - HR Management System

A comprehensive HR Management System built with the MERN stack (MongoDB, Express, React, Node.js). Features include multi-level UI, Role-Based Access Control (RBAC), payroll management, staff management, attendance tracking, project assignment, and employee communication.

## Features

- **Multi-level UI**: Hierarchical navigation with role-based menu visibility
- **RBAC (Role-Based Access Control)**: Five role levels (super_admin, admin, hr_manager, manager, employee)
- **Payroll Management**: Complete payroll processing with salary calculations
- **Staff Management**: Employee directory with search and filtering
- **Attendance Tracking**: Check-in/check-out system with attendance statistics
- **Project Assignment**: Project management with employee assignment
- **Employee Communication**: Real-time messaging system
- **Modern Dashboard**: Analytics and metrics visualization
- **Corporate Design**: Clean, professional UI with professional icons

## Tech Stack

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- JWT Authentication
- Socket.io for real-time communication
- bcryptjs for password hashing

### Frontend
- React 18
- React Router DOM
- Tailwind CSS
- Recharts for data visualization
- Lucide React for professional icons
- Axios for API calls
- Vite as build tool

## Project Structure

```
HRSys/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   └── utils/
│   └── public/
└── README.md
```

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hrsys
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=30d
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

4. Start the backend server:
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory (optional):
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Default Roles & Permissions

- **super_admin**: Full system access
- **admin**: Employee and payroll management
- **hr_manager**: HR functions, payroll, and employee management
- **manager**: Team management and project assignment
- **employee**: View own data, check-in/out, view assigned projects

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Employees
- `GET /api/employees` - Get all employees (with filters)
- `GET /api/employees/:id` - Get employee details
- `POST /api/employees` - Create employee (admin only)
- `PUT /api/employees/:id` - Update employee (admin only)
- `DELETE /api/employees/:id` - Delete employee (admin only)

### Payroll
- `GET /api/payroll` - Get payroll records
- `GET /api/payroll/stats` - Get payroll statistics
- `POST /api/payroll` - Create payroll (admin/hr only)
- `PUT /api/payroll/:id` - Update payroll (admin/hr only)

### Attendance
- `GET /api/attendance` - Get attendance records
- `POST /api/attendance/checkin` - Check in
- `POST /api/attendance/checkout` - Check out
- `GET /api/attendance/stats` - Get attendance statistics

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project (admin/manager only)
- `PUT /api/projects/:id` - Update project
- `PUT /api/projects/:id/assign` - Assign employee to project

### Messages
- `GET /api/messages/conversations` - Get conversations
- `GET /api/messages/:roomId` - Get messages
- `POST /api/messages` - Send message

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## Usage

1. Start MongoDB service
2. Start backend server (`npm run dev` in backend folder)
3. Start frontend server (`npm run dev` in frontend folder)
4. Navigate to `http://localhost:3000`
5. Login with your credentials (or register a new account)

## Development

### Backend Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based route protection
- Input validation
- CORS configuration

## License

This project is open source and available under the MIT License.

## Contributing

Contributions, issues, and feature requests are welcome!
