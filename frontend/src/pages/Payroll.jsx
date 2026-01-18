import { useEffect, useState } from 'react';
import api from '../services/api';
import { DollarSign, Calendar } from 'lucide-react';

const Payroll = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ month: new Date().getMonth() + 1, year: new Date().getFullYear() });

  useEffect(() => {
    fetchPayrolls();
  }, [filters]);

  const fetchPayrolls = async () => {
    try {
      setLoading(true);
      const params = { ...filters };
      const response = await api.get('/payroll', { params });
      setPayrolls(response.data.data);
    } catch (error) {
      console.error('Error fetching payrolls:', error);
    } finally {
      setLoading(false);
    }
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getStatusBadge = (status) => {
    const styles = {
      paid: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      processed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles.pending}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payroll Management</h1>
          <p className="text-sm text-gray-600 mt-1">View and manage employee payrolls</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <select
              value={filters.month}
              onChange={(e) => setFilters({ ...filters, month: parseInt(e.target.value) })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {months.map((month, index) => (
                <option key={index + 1} value={index + 1}>{month}</option>
              ))}
            </select>
          </div>

          <select
            value={filters.year}
            onChange={(e) => setFilters({ ...filters, year: parseInt(e.target.value) })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Base Salary</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Allowances</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deductions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Salary</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payrolls.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      No payroll records found for the selected period
                    </td>
                  </tr>
                ) : (
                  payrolls.map((payroll) => (
                    <tr key={payroll._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <span className="text-primary-700 font-semibold text-sm">
                              {payroll.employeeId?.name?.charAt(0).toUpperCase() || 'E'}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{payroll.employeeId?.name || 'N/A'}</div>
                            <div className="text-xs text-gray-500">{payroll.employeeId?.employeeId || ''}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${payroll.baseSalary?.toLocaleString() || '0.00'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                        +${payroll.allowances?.toLocaleString() || '0.00'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                        -${payroll.deductions?.toLocaleString() || '0.00'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        ${payroll.netSalary?.toLocaleString() || '0.00'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(payroll.status)}</td>
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

export default Payroll;
