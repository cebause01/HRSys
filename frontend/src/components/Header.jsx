import { Search, Mail, Calendar, Users as UsersIcon, UserPlus } from 'lucide-react';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import Modal from './Modal';
import api from '../services/api';

const Header = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteData, setInviteData] = useState({ email: '', name: '', role: 'employee' });

  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/invitations', inviteData);
      if (response.data.data.invitationLink) {
        alert(`Invitation created! Email service not configured. Use this link: ${response.data.data.invitationLink}`);
      } else {
        alert('Invitation email sent successfully!');
      }
      setIsInviteModalOpen(false);
      setInviteData({ email: '', name: '', role: 'employee' });
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to send invitation');
    }
  };

  const getPageTitle = () => {
    const path = location.pathname;
    const titles = {
      '/dashboard': 'Dashboard',
      '/employees': 'Employees',
      '/payroll': 'Payroll',
      '/attendance': 'Attendance',
      '/projects': 'Projects',
      '/messages': 'Messages',
    };
    return titles[path] || 'Dashboard';
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{getPageTitle()}</h2>
          <p className="text-sm text-gray-600 mt-1">
            {getGreeting()}, {user?.name || 'User'}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Quick Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-64"
            />
          </div>

          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Mail className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700">
            <Calendar className="w-5 h-5" />
            <span>{currentDate}</span>
          </div>

          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <UsersIcon className="w-5 h-5" />
          </button>

          <button 
            onClick={() => setIsInviteModalOpen(true)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <UserPlus className="w-4 h-4" />
            Invite
          </button>

          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center ml-2">
            <span className="text-primary-700 font-semibold text-sm">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title="Invite New User"
      >
        <form onSubmit={handleInvite} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={inviteData.name}
              onChange={(e) => setInviteData({ ...inviteData, name: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={inviteData.email}
              onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select
              value={inviteData.role}
              onChange={(e) => setInviteData({ ...inviteData, role: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
              <option value="hr_manager">HR Manager</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsInviteModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Send Invite
            </button>
          </div>
        </form>
      </Modal>
    </header>
  );
};

export default Header;
