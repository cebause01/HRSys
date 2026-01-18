const User = require('../models/User');
const Attendance = require('../models/Attendance');
const Payroll = require('../models/Payroll');
const Project = require('../models/Project');

exports.getDashboardStats = async (req, res) => {
  try {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    // Employee stats
    const totalEmployees = await User.countDocuments({});
    const fulltimeEmployees = await User.countDocuments({ 
      status: 'active',
      role: { $in: ['employee', 'manager', 'hr_manager', 'admin', 'super_admin'] }
    });
    const freelanceEmployees = await User.countDocuments({ 
      role: 'freelancer',
      status: 'active'
    });

    const newEmployeesThisMonth = await User.countDocuments({
      createdAt: {
        $gte: new Date(currentYear, currentMonth - 1, 1),
        $lt: new Date(currentYear, currentMonth, 1)
      }
    });

    // Attendance stats
    const startDate = new Date(currentYear, currentMonth - 1, 1);
    const endDate = new Date(currentYear, currentMonth, 0);
    
    const thisMonthAttendances = await Attendance.find({
      date: { $gte: startDate, $lte: endDate }
    });

    const totalDays = thisMonthAttendances.length;
    const presentDays = thisMonthAttendances.filter(a => 
      a.status === 'present' || a.status === 'on_time'
    ).length;
    const attendanceRate = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

    // Last month attendance for comparison
    const lastMonthStartDate = new Date(lastMonthYear, lastMonth - 1, 1);
    const lastMonthEndDate = new Date(lastMonthYear, lastMonth, 0);
    
    const lastMonthAttendances = await Attendance.find({
      date: { $gte: lastMonthStartDate, $lte: lastMonthEndDate }
    });

    const lastMonthTotalDays = lastMonthAttendances.length;
    const lastMonthPresentDays = lastMonthAttendances.filter(a => 
      a.status === 'present' || a.status === 'on_time'
    ).length;
    const lastMonthRate = lastMonthTotalDays > 0 ? (lastMonthPresentDays / lastMonthTotalDays) * 100 : 0;

    const attendanceChange = attendanceRate - lastMonthRate;

    // Payroll stats
    const payrollStats = [];
    for (let month = 1; month <= 12; month++) {
      const payrolls = await Payroll.find({ month, year: currentYear });
      const income = payrolls.reduce((sum, p) => sum + p.totalEarnings, 0);
      const expense = payrolls.reduce((sum, p) => sum + p.netSalary, 0);
      
      payrollStats.push({
        month,
        income,
        expense
      });
    }

    // Employee performance (top employees by attendance)
    const topEmployees = await User.aggregate([
      {
        $lookup: {
          from: 'attendances',
          localField: '_id',
          foreignField: 'employeeId',
          as: 'attendances'
        }
      },
      {
        $addFields: {
          attendanceCount: { $size: '$attendances' },
          presentCount: {
            $size: {
              $filter: {
                input: '$attendances',
                as: 'att',
                cond: { $in: ['$$att.status', ['present', 'on_time']] }
              }
            }
          }
        }
      },
      {
        $match: {
          status: 'active',
          attendanceCount: { $gt: 0 }
        }
      },
      {
        $addFields: {
          performance: {
            $multiply: [
              { $divide: ['$presentCount', '$attendanceCount'] },
              100
            ]
          }
        }
      },
      {
        $sort: { performance: -1 }
      },
      {
        $limit: 5
      },
      {
        $project: {
          name: 1,
          email: 1,
          employeeId: 1,
          department: 1,
          position: 1,
          performance: 1
        }
      }
    ]);

    // Active projects
    const activeProjects = await Project.countDocuments({ status: 'in_progress' });

    res.status(200).json({
      success: true,
      data: {
        employees: {
          total: totalEmployees,
          fulltime: fulltimeEmployees,
          freelance: freelanceEmployees,
          new: newEmployeesThisMonth
        },
        attendance: {
          rate: Math.round(attendanceRate * 100) / 100,
          change: Math.round(attendanceChange * 100) / 100,
          breakdown: {
            present: thisMonthAttendances.filter(a => a.status === 'present' || a.status === 'on_time').length,
            sick_leave: thisMonthAttendances.filter(a => a.status === 'sick_leave').length,
            day_off: thisMonthAttendances.filter(a => a.status === 'day_off').length,
            absent: thisMonthAttendances.filter(a => a.status === 'absent').length
          }
        },
        payroll: payrollStats,
        topEmployees,
        activeProjects
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
