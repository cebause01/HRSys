const User = require('../models/User');

exports.getEmployees = async (req, res) => {
  try {
    const { status, role, department, search, page = 1, limit = 10 } = req.query;
    
    const query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (role && role !== 'all') {
      query.role = role;
    }
    
    if (department) {
      query.department = department;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } }
      ];
    }

    const employees = await User.find(query)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: employees,
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

exports.getEmployee = async (req, res) => {
  try {
    const employee = await User.findById(req.params.id).select('-password');

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createEmployee = async (req, res) => {
  try {
    const employee = await User.create(req.body);
    
    const token = employee.getSignedJwtToken();

    res.status(201).json({
      success: true,
      data: {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        role: employee.role,
        employeeId: employee.employeeId,
        department: employee.department,
        position: employee.position
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Employee ID or Email already exists' });
    }
    res.status(500).json({ message: error.message });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const employee = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).select('-password');

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await User.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Employee deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEmployeeStats = async (req, res) => {
  try {
    const totalEmployees = await User.countDocuments({});
    const fulltimeEmployees = await User.countDocuments({ role: { $in: ['employee', 'manager', 'hr_manager'] }, status: 'active' });
    const freelanceEmployees = await User.countDocuments({ role: 'freelancer' });
    const activeEmployees = await User.countDocuments({ status: 'active' });
    
    const newEmployees = await User.countDocuments({
      createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) }
    });

    res.status(200).json({
      success: true,
      data: {
        total: totalEmployees,
        fulltime: fulltimeEmployees,
        freelance: freelanceEmployees,
        active: activeEmployees,
        new: newEmployees
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
