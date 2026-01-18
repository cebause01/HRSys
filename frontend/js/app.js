// Main App Initialization
console.log('TurHR: Initializing application...');

// Check authentication on page load
document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname;
    
    // Redirect if trying to access protected pages without auth
    const protectedPages = ['dashboard.html', 'employees.html', 'payroll.html', 'attendance.html', 'projects.html', 'messages.html'];
    const isProtectedPage = protectedPages.some(page => currentPage.includes(page));
    
    if (isProtectedPage && !auth.isAuthenticated()) {
        window.location.href = '/login.html';
        return;
    }
    
    // Redirect if logged in and trying to access login
    if (currentPage.includes('login.html') && auth.isAuthenticated()) {
        window.location.href = '/dashboard.html';
        return;
    }
    
    console.log('TurHR: Application initialized');
});
