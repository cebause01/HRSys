import { useEffect, useState } from 'react';
import api from '../services/api';
import { Users, TrendingUp, Clock, DollarSign } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get('/dashboard/stats');
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Unable to load dashboard data</p>
          <p className="text-sm text-gray-500">Please ensure the backend server is running and MongoDB is connected.</p>
        </div>
      </div>
    );
  }

  const payrollData = stats.payroll || [];

  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981'];

  const attendanceData = stats.attendance?.breakdown || {};
  const attendancePieData = [
    { name: 'On time', value: attendanceData.present || 0, color: '#10b981' },
    { name: 'Sick Leave', value: attendanceData.sick_leave || 0, color: '#f59e0b' },
    { name: 'Day Off', value: attendanceData.day_off || 0, color: '#3b82f6' },
  ];

  return (
    <div className="space-y-6">
      {/* Employee Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Total Employees</h3>
            <Users className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-bold text-gray-900">{stats.employees?.total || 0}</span>
            <span className="text-sm text-green-600">+{stats.employees?.new || 0}</span>
          </div>
          <div className="space-y-2 mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Fulltime Employee</span>
              <span className="font-medium">{stats.employees?.fulltime || 0}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Freelance Employee</span>
              <span className="font-medium">{stats.employees?.freelance || 0}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '25%' }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Attendance Overview</h3>
            <Clock className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-bold text-gray-900">{stats.attendance?.rate?.toFixed(0) || 0}%</span>
            <span className="text-sm text-green-600">
              {stats.attendance?.change > 0 ? '+' : ''}{stats.attendance?.change?.toFixed(0) || 0}% since last month
            </span>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span>Sick Leave: {attendanceData.sick_leave || 0}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>Day Off: {attendanceData.day_off || 0}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>On time: {attendanceData.present || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600 mb-4">Active Projects</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">{stats.activeProjects || 0}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Performance</h3>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">98%</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">Consistent punctuality and quality work</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Income Statistics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={payrollData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="income" fill="#8b5cf6" name="Income" />
              <Bar dataKey="expense" fill="#3b82f6" name="Expense" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={attendancePieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {attendancePieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Employees */}
      {stats.topEmployees && stats.topEmployees.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Employee Performance Ratings</h3>
          <div className="space-y-4">
            {stats.topEmployees.slice(0, 5).map((employee, index) => (
              <div key={employee._id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-primary-700 font-semibold text-sm">
                      {employee.name?.charAt(0).toUpperCase() || 'E'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{employee.name}</p>
                    <p className="text-xs text-gray-500">{employee.department || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-48">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${employee.performance || 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-16 text-right">
                    {employee.performance?.toFixed(0) || 0}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
