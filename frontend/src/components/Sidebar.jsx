import { NavLink, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
  LayoutDashboard,
  FolderKanban,
  Calendar,
  FileText,
  Settings,
  Bell,
  HelpCircle,
  TrendingUp,
  DollarSign,
  Receipt,
  Users,
  UserPlus,
  CreditCard,
  PieChart,
  FolderOpen,
  MessageSquare,
  LogOut
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout, hasRole, hasPermission } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const primaryNav = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/projects', label: 'Projects', icon: FolderKanban },
    { path: '/attendance', label: 'Leave Management', icon: Calendar },
    { path: '/messages', label: 'Notification', icon: Bell },
    { path: '/settings', label: 'Settings', icon: Settings },
    { path: '/help', label: 'Help & Center', icon: HelpCircle },
  ];

  const teamManagementNav = [
    { path: '/performance', label: 'Performance', icon: TrendingUp, permission: 'view_reports' },
    { path: '/payroll', label: 'Payrolls', icon: DollarSign, permission: 'manage_payroll' },
    { path: '/invoices', label: 'Invoices', icon: Receipt, permission: 'manage_payroll' },
    { path: '/employees', label: 'Employees', icon: Users, permission: 'manage_employees' },
    { path: '/recruitment', label: 'Recruitment & Hiring', icon: UserPlus, permission: 'manage_employees' },
  ];

  const listNav = [
    { path: '/salary-info', label: 'Salary Information', icon: CreditCard, permission: 'manage_payroll' },
    { path: '/compensation', label: 'Compensation Breakdown', icon: PieChart, permission: 'manage_payroll' },
    { path: '/project-data', label: 'Project-specific Data', icon: FolderOpen, permission: 'view_reports' },
  ];

  const canAccess = (item) => {
    if (!item.permission) return true;
    return hasPermission(item.permission);
  };

  const NavItem = ({ item }) => {
    if (!canAccess(item)) return null;

    return (
      <NavLink
        to={item.path}
        className={({ isActive }) =>
          `flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
            isActive
              ? 'bg-primary-50 text-primary-700'
              : 'text-gray-700 hover:bg-gray-100'
          }`
        }
      >
        <item.icon className="w-5 h-5" />
        <span>{item.label}</span>
      </NavLink>
    );
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">TurHR</h1>
      </div>

      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
            <span className="text-primary-700 font-semibold text-sm">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {primaryNav.map((item) => (
          <NavItem key={item.path} item={item} />
        ))}

        {(hasRole(['super_admin', 'admin', 'hr_manager', 'manager']) || hasPermission('view_reports')) && (
          <>
            <div className="pt-4 mt-4 border-t border-gray-200">
              <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                TEAM MANAGEMENT
              </h3>
              {teamManagementNav.map((item) => (
                <NavItem key={item.path} item={item} />
              ))}
            </div>

            <div className="pt-4 mt-4 border-t border-gray-200">
              <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                LIST
              </h3>
              {listNav.map((item) => (
                <NavItem key={item.path} item={item} />
              ))}
            </div>
          </>
        )}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
