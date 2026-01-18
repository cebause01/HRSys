import { useEffect, useState } from 'react';
import api from '../services/api';
import { Plus, Search, FolderKanban, Users } from 'lucide-react';
import Modal from '../components/Modal';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: 'all', search: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'planning',
    priority: 'medium',
    department: ''
  });

  useEffect(() => {
    fetchProjects();
  }, [filters]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params = { ...filters };
      const response = await api.get('/projects', { params });
      setProjects(response.data.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', formData);
      setIsModalOpen(false);
      setFormData({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        status: 'planning',
        priority: 'medium',
        department: ''
      });
      fetchProjects();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create project');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      planning: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-green-100 text-green-800',
      on_hold: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles.planning}`}>
        {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-sm text-gray-600 mt-1">Manage and track project assignments</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 w-full"
            />
          </div>

          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Status</option>
            <option value="planning">Planning</option>
            <option value="in_progress">In Progress</option>
            <option value="on_hold">On Hold</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.length === 0 ? (
              <div className="col-span-full p-8 text-center text-gray-500">
                No projects found
              </div>
            ) : (
              projects.map((project) => (
                <div key={project._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FolderKanban className="w-5 h-5 text-primary-600" />
                      <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                    </div>
                    {getStatusBadge(project.status)}
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description || 'No description'}</p>

                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <span>Start: {new Date(project.startDate).toLocaleDateString()}</span>
                    {project.endDate && (
                      <span>End: {new Date(project.endDate).toLocaleDateString()}</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{project.assignedEmployees?.length || 0} assigned</span>
                    </div>
                    <span className="text-xs text-gray-500 capitalize">{project.priority || 'medium'} priority</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Project"
      >
        <form onSubmit={handleCreateProject} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="planning">Planning</option>
                <option value="in_progress">In Progress</option>
                <option value="on_hold">On Hold</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Create Project
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Projects;
