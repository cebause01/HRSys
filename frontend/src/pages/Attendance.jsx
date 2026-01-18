import { useEffect, useState } from 'react';
import api from '../services/api';
import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';

const Attendance = () => {
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(1)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchAttendances();
    fetchStats();
  }, [dateRange]);

  const fetchAttendances = async () => {
    try {
      setLoading(true);
      const params = { startDate: dateRange.startDate, endDate: dateRange.endDate };
      const response = await api.get('/attendance', { params });
      setAttendances(response.data.data);
    } catch (error) {
      console.error('Error fetching attendances:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const params = { startDate: dateRange.startDate, endDate: dateRange.endDate };
      const response = await api.get('/attendance/stats', { params });
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching attendance stats:', error);
    }
  };

  const handleCheckIn = async () => {
    try {
      await api.post('/attendance/checkin');
      fetchAttendances();
      fetchStats();
    } catch (error) {
      alert(error.response?.data?.message || 'Check-in failed');
    }
  };

  const handleCheckOut = async () => {
    try {
      await api.post('/attendance/checkout');
      fetchAttendances();
      fetchStats();
    } catch (error) {
      alert(error.response?.data?.message || 'Check-out failed');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      present: 'bg-green-100 text-green-800',
      on_time: 'bg-green-100 text-green-800',
      absent: 'bg-red-100 text-red-800',
      late: 'bg-yellow-100 text-yellow-800',
      sick_leave: 'bg-orange-100 text-orange-800',
      vacation: 'bg-blue-100 text-blue-800',
      day_off: 'bg-gray-100 text-gray-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles.absent}`}>
        {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance Management</h1>
          <p className="text-sm text-gray-600 mt-1">Track and manage employee attendance</p>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Attendance Rate</div>
            <div className="text-2xl font-bold text-gray-900">{stats.attendanceRate?.toFixed(1) || 0}%</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Present Days</div>
            <div className="text-2xl font-bold text-green-600">{stats.presentDays || 0}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Absent Days</div>
            <div className="text-2xl font-bold text-red-600">{stats.statusBreakdown?.absent || 0}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Total Days</div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalDays || 0}</div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleCheckIn}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Check In
            </button>
            <button
              onClick={handleCheckOut}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
            >
              <XCircle className="w-4 h-4" />
              Check Out
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours Worked</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendances.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      No attendance records found for the selected period
                    </td>
                  </tr>
                ) : (
                  attendances.map((attendance) => (
                    <tr key={attendance._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(attendance.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {attendance.employeeId?.name || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {attendance.checkIn ? new Date(attendance.checkIn).toLocaleTimeString() : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {attendance.checkOut ? new Date(attendance.checkOut).toLocaleTimeString() : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {attendance.hoursWorked ? `${attendance.hoursWorked} hrs` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(attendance.status)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;
