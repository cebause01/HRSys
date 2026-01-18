import { useEffect, useState } from 'react';
import api from '../services/api';
import { Search, Filter, Download, Eye, MoreVertical } from 'lucide-react';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: 'all', role: 'all', search: '' });
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });

  useEffect(() => {
    fetchEmployees();
  }, [filters, pagination.page]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        page: pagination.page,
        limit: pagination.limit
      };
      const response = await api.get('/employees', { params });
      setEmployees(response.data.data);
      setPagination(prev => ({ ...prev, total: response.data.pagination.total }));
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      on_leave: 'bg-yellow-100 text-yellow-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles.inactive}`}>
        {status === 'active' ? 'Full-time' : status === 'on_leave' ? 'On Leave' : 'Inactive'}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Employees</h1>
          <p className="text-sm text-gray-600 mt-1">Manage and view employee information</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between flex-wrap gap-4">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search Employee"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 w-full"
            />
          </div>

          <div className="flex items-center gap-3">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="on_leave">On Leave</option>
            </select>

            <select
              value={filters.role}
              onChange={(e) => setFilters({ ...filters, role: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Role</option>
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
              <option value="hr_manager">HR Manager</option>
              <option value="admin">Admin</option>
            </select>

            <button 
              onClick={() => {
                const csv = ['Name,Email,Role,Department,Status', ...employees.map(e => 
                  `"${e.name}","${e.email}","${e.role}","${e.department || 'N/A'}","${e.status}"`
                )].join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `employees_${new Date().toISOString().split('T')[0]}.csv`;
                a.click();
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departments</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {employees.map((employee) => (
                    <tr key={employee._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.employeeId || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <span className="text-primary-700 font-semibold text-sm">
                              {employee.name?.charAt(0).toUpperCase() || 'E'}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{employee.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{employee.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.position || employee.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{employee.department || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(employee.status)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button className="p-1 text-gray-400 hover:text-gray-600">
                            <Eye className="w-5 h-5" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-gray-600">
                            <MoreVertical className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pagination.total > pagination.limit && (
              <div className="p-4 border-t border-gray-200 flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Showing {(pagination.page - 1) * pagination.limit + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPagination({ ...pagination, page: Math.max(1, pagination.page - 1) })}
                    disabled={pagination.page === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                    disabled={pagination.page * pagination.limit >= pagination.total}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Employees;
