const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const Payroll = require('../models/Payroll');
const PerformanceReview = require('../models/PerformanceReview');

router.get('/turnover-risk', protect, authorize('admin', 'hr_manager', 'super_admin'), async (req, res) => {
  try {
    // Simple predictive model: employees with low performance, recent attendance issues, or long tenure without promotion
    const employees = await User.find({ status: 'active' });
    const reviews = await PerformanceReview.find().populate('employeeId');
    const attendances = await Attendance.find();
    
    const riskScores = employees.map(emp => {
      let risk = 0;
      const empReviews = reviews.filter(r => r.employeeId._id.toString() === emp._id.toString());
      const empAttendance = attendances.filter(a => a.employeeId.toString() === emp._id.toString());
      
      // Low performance increases risk
      if (empReviews.length > 0) {
        const avgRating = empReviews.reduce((sum, r) => sum + r.ratings.overall, 0) / empReviews.length;
        if (avgRating < 3) risk += 30;
      }
      
      // Recent attendance issues
      const recentAbsences = empAttendance.filter(a => 
        a.status === 'absent' && new Date(a.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      ).length;
      if (recentAbsences > 3) risk += 25;
      
      // Long tenure without promotion (simplified)
      if (emp.hireDate && new Date() - new Date(emp.hireDate) > 3 * 365 * 24 * 60 * 60 * 1000) {
        risk += 15;
      }
      
      return { employee: emp, riskScore: Math.min(risk, 100) };
    });
    
    const highRisk = riskScores.filter(s => s.riskScore > 50).sort((a, b) => b.riskScore - a.riskScore);
    
    res.json({ success: true, data: highRisk });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/workforce-planning', protect, authorize('admin', 'hr_manager', 'super_admin'), async (req, res) => {
  try {
    const { department, projection } = req.query;
    const projectionMonths = parseInt(projection) || 12;
    
    const current = await User.countDocuments({ 
      status: 'active',
      ...(department && { department })
    });
    
    // Simple projection (can be enhanced with historical data)
    const projections = [];
    for (let i = 0; i < projectionMonths; i++) {
      projections.push({
        month: new Date(Date.now() + i * 30 * 24 * 60 * 60 * 1000),
        estimated: current // Simplified
      });
    }
    
    res.json({ success: true, data: { current, projections } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/dei', protect, authorize('admin', 'hr_manager', 'super_admin'), async (req, res) => {
  try {
    const employees = await User.find({ status: 'active' });
    
    // Simplified DEI metrics
    const dei = {
      total: employees.length,
      byGender: {},
      byDepartment: {},
      byRole: {}
    };
    
    employees.forEach(emp => {
      // These fields would need to be added to User model
      // Simplified version
      dei.byDepartment[emp.department || 'Unassigned'] = (dei.byDepartment[emp.department || 'Unassigned'] || 0) + 1;
      dei.byRole[emp.role] = (dei.byRole[emp.role] || 0) + 1;
    });
    
    res.json({ success: true, data: dei });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
