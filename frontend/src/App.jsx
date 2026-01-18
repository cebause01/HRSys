import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import ProtectedRoute from './utils/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import Login from './pages/Login';
import AcceptInvitation from './pages/AcceptInvitation';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Payroll from './pages/Payroll';
import Attendance from './pages/Attendance';
import Projects from './pages/Projects';
import Messages from './pages/Messages';
import Layout from './components/Layout';
import { useContext } from 'react';

function AppRoutes() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading TurHR...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/accept-invitation/:token" element={<AcceptInvitation />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="employees" element={<Employees />} />
        <Route path="payroll" element={<Payroll />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="projects" element={<Projects />} />
        <Route path="messages" element={<Messages />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
