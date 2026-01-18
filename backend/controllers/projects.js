const Project = require('../models/Project');
const User = require('../models/User');

exports.getProjects = async (req, res) => {
  try {
    const { status, department, search, page = 1, limit = 10 } = req.query;
    
    const query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (department) {
      query.department = department;
    }
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // If user is employee, only show projects they're assigned to
    if (req.user.role === 'employee') {
      query['assignedEmployees.employeeId'] = req.user.id;
    }

    const projects = await Project.find(query)
      .populate('assignedEmployees.employeeId', 'name email employeeId department position')
      .populate('createdBy', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Project.countDocuments(query);

    res.status(200).json({
      success: true,
      data: projects,
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

exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('assignedEmployees.employeeId', 'name email employeeId department position')
      .populate('createdBy', 'name email');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createProject = async (req, res) => {
  try {
    const projectData = {
      ...req.body,
      createdBy: req.user.id
    };

    const project = await Project.create(projectData);

    res.status(201).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
      .populate('assignedEmployees.employeeId', 'name email employeeId department position')
      .populate('createdBy', 'name email');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.assignEmployee = async (req, res) => {
  try {
    const { employeeId, role } = req.body;
    
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if employee is already assigned
    const existingAssignment = project.assignedEmployees.find(
      emp => emp.employeeId.toString() === employeeId
    );

    if (existingAssignment) {
      return res.status(400).json({ message: 'Employee already assigned to this project' });
    }

    project.assignedEmployees.push({
      employeeId,
      role: role || 'developer'
    });

    await project.save();

    const updatedProject = await Project.findById(req.params.id)
      .populate('assignedEmployees.employeeId', 'name email employeeId department position')
      .populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      data: updatedProject
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeEmployee = async (req, res) => {
  try {
    const { employeeId } = req.body;
    
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    project.assignedEmployees = project.assignedEmployees.filter(
      emp => emp.employeeId.toString() !== employeeId
    );

    await project.save();

    const updatedProject = await Project.findById(req.params.id)
      .populate('assignedEmployees.employeeId', 'name email employeeId department position')
      .populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      data: updatedProject
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
