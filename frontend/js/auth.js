// Authentication Functions
const auth = {
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },
    
    getUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
    
    hasRole: (roles) => {
        const user = auth.getUser();
        if (!user) return false;
        return roles.includes(user.role);
    },
    
    hasPermission: (permission) => {
        const user = auth.getUser();
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
    },
    
    login: async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            if (response.success) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));
                return { success: true };
            }
            return { success: false, message: response.message || 'Login failed' };
        } catch (error) {
            return { success: false, message: error.message || 'Login failed' };
        }
    },
    
    register: async (name, email, password, role = 'employee') => {
        try {
            const response = await api.post('/auth/register', { name, email, password, role });
            if (response.success) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));
                return { success: true };
            }
            return { success: false, message: response.message || 'Registration failed' };
        } catch (error) {
            return { success: false, message: error.message || 'Registration failed' };
        }
    },
    
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login.html';
    }
};
