// Shared Components
const navItemClass = 'flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors';

const components = {
    // Sidebar HTML
    sidebar: (user) => {
        const canAccessTeamManagement = auth.hasRole(['super_admin', 'admin', 'hr_manager', 'manager']) || auth.hasPermission('view_reports');
        
        return `
            <div class="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
                <div class="p-6 border-b border-gray-200">
                    <h1 class="text-2xl font-bold text-gray-900">TurHR</h1>
                </div>

                <div class="p-4 border-b border-gray-200">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <span class="text-primary-700 font-semibold text-sm">
                                ${user?.name?.charAt(0).toUpperCase() || 'U'}
                            </span>
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium text-gray-900 truncate">${user?.name || 'User'}</p>
                            <p class="text-xs text-gray-500 truncate">${user?.email || ''}</p>
                        </div>
                    </div>
                </div>

                <nav class="flex-1 overflow-y-auto p-4 space-y-1">
                    <a href="/dashboard.html" class="${navItemClass} nav-item" data-page="dashboard">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                        </svg>
                        <span>Dashboard</span>
                    </a>
                    <a href="/projects.html" class="${navItemClass} nav-item" data-page="projects">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                        </svg>
                        <span>Projects</span>
                    </a>
                    <a href="/leave-management.html" class="${navItemClass} nav-item" data-page="leave-management">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <span>Leave Management</span>
                    </a>
                    <a href="/messages.html" class="${navItemClass} nav-item" data-page="messages">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                        </svg>
                        <span>Notification</span>
                    </a>
                    
                    ${canAccessTeamManagement ? `
                        <div class="pt-4 mt-4 border-t border-gray-200">
                            <h3 class="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">TEAM MANAGEMENT</h3>
                            <a href="/performance.html" class="${navItemClass} nav-item" data-page="performance">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                                </svg>
                                <span>Performance</span>
                            </a>
                            <a href="/payroll.html" class="${navItemClass} nav-item" data-page="payroll">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span>Payrolls</span>
                            </a>
                            <a href="/employees.html" class="${navItemClass} nav-item" data-page="employees">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                                </svg>
                                <span>Employees</span>
                            </a>
                            <a href="/org-chart.html" class="${navItemClass} nav-item" data-page="org-chart">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                                </svg>
                                <span>Organization Chart</span>
                            </a>
                            <a href="/documents.html" class="${navItemClass} nav-item" data-page="documents">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                                <span>Documents</span>
                            </a>
                            <a href="/recruitment.html" class="${navItemClass} nav-item" data-page="recruitment">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                                </svg>
                                <span>Recruitment & Hiring</span>
                            </a>
                            <a href="/onboarding.html" class="${navItemClass} nav-item" data-page="onboarding">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span>Onboarding</span>
                            </a>
                            <a href="/learning.html" class="${navItemClass} nav-item" data-page="learning">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                                </svg>
                                <span>Learning & Development</span>
                            </a>
                            <a href="/engagement.html" class="${navItemClass} nav-item" data-page="engagement">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span>Employee Engagement</span>
                            </a>
                            <a href="/analytics.html" class="${navItemClass} nav-item" data-page="analytics">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                                </svg>
                                <span>Advanced Analytics</span>
                            </a>
                        </div>
                    ` : ''}
                </nav>

                <div class="p-4 border-t border-gray-200">
                    <button onclick="auth.logout()" class="${navItemClass} w-full text-left">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                        </svg>
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        `;
    },
    
    // Header HTML
    header: (user, pageTitle) => {
        const hour = new Date().getHours();
        const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
        const currentDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        
        return `
            <header class="bg-white border-b border-gray-200 px-6 py-4">
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-xl font-semibold text-gray-900">${pageTitle}</h2>
                        <p class="text-sm text-gray-600 mt-1">${greeting}, ${user?.name || 'User'}</p>
                    </div>

                    <div class="flex items-center gap-4">
                        <div class="relative">
                            <input
                                type="text"
                                placeholder="Quick Search..."
                                class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 w-64"
                            />
                        </div>

                        <div class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            <span>${currentDate}</span>
                        </div>

                        <button onclick="openInviteModal()" class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 text-sm font-medium">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                            </svg>
                            Invite
                        </button>

                        <div class="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center ml-2">
                            <span class="text-primary-700 font-semibold text-sm">
                                ${user?.name?.charAt(0).toUpperCase() || 'U'}
                            </span>
                        </div>
                    </div>
                </div>
            </header>
        `;
    }
};

// Initialize navigation highlighting
document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
    document.querySelectorAll('.nav-item').forEach(item => {
        const baseClasses = navItemClass;
        item.className = baseClasses + ' nav-item';
        if (item.dataset.page === currentPage) {
            item.classList.add('bg-primary-50', 'text-primary-700');
        } else {
            item.classList.add('text-gray-700', 'hover:bg-gray-100');
        }
    });
});
