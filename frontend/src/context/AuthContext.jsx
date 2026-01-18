import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      verifyToken();
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data.data);
      localStorage.setItem('user', JSON.stringify(response.data.data));
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const register = async (name, email, password, role = 'employee') => {
    try {
      const response = await api.post('/auth/register', { name, email, password, role });
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const hasRole = (roles) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const hasPermission = (permission) => {
    if (!user) return false;
    
    const rolePermissions = {
      super_admin: ['all'],
      admin: ['manage_employees', 'manage_payroll', 'manage_projects', 'view_reports'],
      hr_manager: ['manage_employees', 'manage_payroll', 'view_reports'],
      manager: ['manage_team', 'view_reports'],
      employee: ['view_own', 'update_own']
    };

    const permissions = rolePermissions[user.role] || [];
    return permissions.includes('all') || permissions.includes(permission);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        hasRole,
        hasPermission
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
