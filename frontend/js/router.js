// Simple Router
const router = {
    currentRoute: () => {
        const path = window.location.pathname;
        if (path === '/' || path === '/index.html') {
            return auth.isAuthenticated() ? '/dashboard.html' : '/login.html';
        }
        return path;
    },
    
    navigate: (path) => {
        window.location.href = path;
    },
    
    init: () => {
        const route = router.currentRoute();
        if (route.includes('.html')) {
            // Let the browser handle HTML file navigation
            return;
        }
        
        // Protected routes
        const protectedRoutes = ['/dashboard', '/employees', '/payroll', '/attendance', '/projects', '/messages'];
        if (protectedRoutes.includes(route) && !auth.isAuthenticated()) {
            router.navigate('/login.html');
        }
    }
};

// Initialize router on load
document.addEventListener('DOMContentLoaded', router.init);
