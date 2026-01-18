const Payroll = require('../models/Payroll');
const User = require('../models/User');

exports.getPayrolls = async (req, res) => {
  try {
    const { employeeId, month, year, status, page = 1, limit = 10 } = req.query;
    
    const query = {};
    
    if (employeeId) query.employeeId = employeeId;
    if (month) query.month = parseInt(month);
    if (year) query.year = parseInt(year);
    if (status) query.status = status;

    // If user is not admin/hr, only show their own payroll
    if (req.user.role === 'employee' || req.user.role === 'manager') {
      query.employeeId = req.user.id;
    }

    const payrolls = await Payroll.find(query)
      .populate('employeeId', 'name email employeeId department position')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ year: -1, month: -1 });

    const total = await Payroll.countDocuments(query);

    res.status(200).json({
      success: true,
      data: payrolls,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPayroll = async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id)
      .populate('employeeId', 'name email employeeId department position');

    if (!payroll) {
      return res.status(404).json({ message: 'Payroll not found' });
    }

    // Check authorization
    if ((req.user.role === 'employee' || req.user.role === 'manager') && 
        payroll.employeeId._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this payroll' });
    }

    res.status(200).json({
      success: true,
      data: payroll
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createPayroll = async (req, res) => {
  try {
    const payroll = await Payroll.create(req.body);

    res.status(201).json({
      success: true,
      data: payroll
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Payroll record already exists for this employee, month, and year' });
    }
    res.status(500).json({ message: error.message });
  }
};

exports.updatePayroll = async (req, res) => {
  try {
    const payroll = await Payroll.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('employeeId', 'name email employeeId department position');

    if (!payroll) {
      return res.status(404).json({ message: 'Payroll not found' });
    }

    res.status(200).json({
      success: true,
      data: payroll
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deletePayroll = async (req, res) => {
  try {
    const payroll = await Payroll.findByIdAndDelete(req.params.id);

    if (!payroll) {
      return res.status(404).json({ message: 'Payroll not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Payroll deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPayrollStats = async (req, res) => {
  try {
    const { year } = req.query;
    const currentYear = year ? parseInt(year) : new Date().getFullYear();

    const monthlyStats = [];
    
    for (let month = 1; month <= 12; month++) {
      const payrolls = await Payroll.find({ month, year: currentYear });
      const income = payrolls.reduce((sum, p) => sum + p.totalEarnings, 0);
      const expense = payrolls.reduce((sum, p) => sum + p.netSalary, 0);
      
      monthlyStats.push({
        month,
        income,
        expense
      });
    }

    res.status(200).json({
      success: true,
      data: monthlyStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
