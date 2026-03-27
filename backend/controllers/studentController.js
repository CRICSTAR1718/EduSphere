const User = require("../models/User");
const Attendance = require("../models/Attendance");
const Result = require("../models/Result");
const Grievance = require("../models/Grievance");
const Notification = require("../models/Notification");
const Gatepass = require("../models/Gatepass");
const Fee = require("../models/Fee");
const Course = require("../models/Course");
const Exam = require("../models/Exam");
const Enrollment = require("../models/Enrollment");
const mongoose = require("mongoose");

// ==================== DASHBOARD & PROFILE ====================

// @desc    Get student profile
// @route   GET /api/student/profile
// @access  Private (student)
const getProfile = async (req, res) => {
    try {
        const student = await User.findById(req.user.id).select("-password");
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.status(200).json(student);
    } catch (error) {
        console.error("Get profile error:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Update student profile
// @route   PUT /api/student/profile
// @access  Private (student)
const updateProfile = async (req, res) => {
    try {
        const { name, phone, department, semester, enrollmentNo } = req.body;

        const student = await User.findById(req.user.id);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Update allowed fields only
        if (name) student.name = name;
        if (phone) student.phone = phone;
        if (department) student.department = department;
        if (semester) student.semester = semester;
        if (enrollmentNo) student.enrollmentNo = enrollmentNo;

        await student.save();

        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: student._id,
                name: student.name,
                email: student.email,
                role: student.role,
                phone: student.phone,
                department: student.department,
                semester: student.semester,
                enrollmentNo: student.enrollmentNo,
            },
        });
    } catch (error) {
        console.error("Update profile error:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ==================== ATTENDANCE ====================

// @desc    Get student attendance (aggregated by subject)
// @route   GET /api/student/attendance
// @access  Private (student)
const getAttendance = async (req, res) => {
    try {
        const studentId = new mongoose.Types.ObjectId(req.user._id);

        // Aggregate attendance by subject
        const attendance = await Attendance.aggregate([
            { $match: { student: studentId } },
            {
                $group: {
                    _id: "$subject",
                    totalClasses: { $sum: 1 },
                    classesAttended: {
                        $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    subject: "$_id",
                    totalClasses: 1,
                    classesAttended: 1,
                    percentage: {
                        $round: [
                            {
                                $multiply: [
                                    { $divide: ["$classesAttended", "$totalClasses"] },
                                    100,
                                ],
                            },
                            1,
                        ],
                    },
                },
            },
            { $sort: { subject: 1 } },
        ]);

        res.status(200).json(attendance);
    } catch (error) {
        console.error("Get attendance error:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ==================== RESULTS ====================

// @desc    Get student results
// @route   GET /api/student/results
// @access  Private (student)
const getResults = async (req, res) => {
    try {
        const results = await Result.find({ student: req.user.id })
            .select("subject examType marks totalMarks grade semester")
            .sort({ semester: -1, subject: 1 });

        res.status(200).json(results);
    } catch (error) {
        console.error("Get results error:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ==================== NOTIFICATIONS ====================

// @desc    Get notifications for students
// @route   GET /api/student/notifications
// @access  Private (student)
const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({
            isActive: true,
            targetRole: { $in: ["all", "student"] },
        })
            .sort({ createdAt: -1 })
            .limit(20)
            .populate("createdBy", "name");

        res.status(200).json(notifications);
    } catch (error) {
        console.error("Get notifications error:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ==================== GRIEVANCES ====================

// @desc    Submit a new grievance
// @route   POST /api/student/grievance
// @access  Private (student)
const submitGrievance = async (req, res) => {
    try {
        const { subject, description } = req.body;

        if (!subject || !description) {
            return res.status(400).json({ message: "Subject and description are required" });
        }

        const grievance = await Grievance.create({
            student: req.user.id,
            subject,
            description,
        });

        res.status(201).json({
            message: "Grievance submitted successfully",
            grievance,
        });
    } catch (error) {
        console.error("Submit grievance error:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Get all grievances by the student
// @route   GET /api/student/grievances
// @access  Private (student)
const getGrievances = async (req, res) => {
    try {
        const grievances = await Grievance.find({ student: req.user.id })
            .sort({ createdAt: -1 })
            .populate("respondedBy", "name");

        res.status(200).json(grievances);
    } catch (error) {
        console.error("Get grievances error:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ==================== DASHBOARD STATS ====================

// @desc    Get student dashboard summary
// @route   GET /api/student/dashboard
// @access  Private (student)
const getDashboardStats = async (req, res) => {
    try {
        const studentId = new mongoose.Types.ObjectId(req.user._id);

        // Overall attendance percentage
        const attendanceData = await Attendance.aggregate([
            { $match: { student: studentId } },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    attended: {
                        $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] },
                    },
                },
            },
        ]);

        const overallAttendance =
            attendanceData.length > 0
                ? Math.round((attendanceData[0].attended / attendanceData[0].total) * 100)
                : 0;

        // Average GPA (simplified: average marks / 10)
        const resultsData = await Result.aggregate([
            { $match: { student: studentId } },
            {
                $group: {
                    _id: null,
                    avgMarks: { $avg: "$marks" },
                },
            },
        ]);

        const avgGPA =
            resultsData.length > 0
                ? (resultsData[0].avgMarks / 10).toFixed(1)
                : "0.0";

        // Pending grievances count
        const pendingGrievances = await Grievance.countDocuments({
            student: studentId,
            status: "pending",
        });

        // Subject-wise attendance for chart
        const subjectAttendance = await Attendance.aggregate([
            { $match: { student: studentId } },
            {
                $group: {
                    _id: "$subject",
                    total: { $sum: 1 },
                    attended: {
                        $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    subject: "$_id",
                    percentage: {
                        $round: [
                            { $multiply: [{ $divide: ["$attended", "$total"] }, 100] },
                            0,
                        ],
                    },
                },
            },
            { $sort: { subject: 1 } },
        ]);

        // Enrolled courses count
        const enrolledCourses = await Enrollment.countDocuments({
            student: studentId,
            status: "enrolled",
        });

        res.status(200).json({
            overallAttendance: `${overallAttendance}%`,
            avgGPA,
            pendingGrievances,
            subjectAttendance,
            enrolledCourses,
        });
    } catch (error) {
        console.error("Dashboard stats error:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ==================== GATEPASS ====================

// @desc    Request a gatepass
// @route   POST /api/student/gatepass
// @access  Private (student)
const requestGatepass = async (req, res) => {
    try {
        const { type, reason, outDate, inDate } = req.body;

        if (!type || !reason || !outDate || !inDate) {
            return res.status(400).json({ message: "type, reason, outDate and inDate are required" });
        }

        const gatepass = await Gatepass.create({
            student: req.user.id,
            type,
            reason,
            outDate: new Date(outDate),
            inDate: new Date(inDate),
            status: "pending_parent",
        });

        res.status(201).json({ message: "Gatepass requested successfully. Awaiting parent approval.", gatepass });
    } catch (error) {
        console.error("Request gatepass error:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Get student's gatepass history
// @route   GET /api/student/gatepasses
// @access  Private (student)
const getGatepasses = async (req, res) => {
    try {
        const gatepasses = await Gatepass.find({ student: req.user.id })
            .populate("warden", "name")
            .sort({ createdAt: -1 });

        res.status(200).json(gatepasses);
    } catch (error) {
        console.error("Get gatepasses error:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ==================== FEES ====================

// @desc    Get student's fee records
// @route   GET /api/student/fees
// @access  Private (student)
const getFees = async (req, res) => {
    try {
        const fees = await Fee.find({ student: req.user.id }).sort({ dueDate: -1 });
        res.status(200).json(fees);
    } catch (error) {
        console.error("Get Fees Error:", error);
        res.status(500).json({ message: "Server error while fetching fees" });
    }
};

// ==================== COURSES & EXAMS ====================

// @desc    Get registered courses for the student
// @route   GET /api/student/courses
// @access  Private/Student
const getCourses = async (req, res) => {
    try {
        const student = await User.findById(req.user._id);
        
        // Fetch courses that match the student's department and semester
        const courses = await Course.find({
            department: student.department,
            semester: student.semester
        }).populate("faculty", "name");
        
        res.status(200).json({ count: courses.length, courses });
    } catch (error) {
        console.error("Get Courses Error:", error);
        res.status(500).json({ message: "Server error while fetching courses" });
    }
};

// @desc    Get upcoming exams for the student
// @route   GET /api/student/exams
// @access  Private/Student
const getExams = async (req, res) => {
    try {
        const student = await User.findById(req.user._id);
        
        // Fetch exams related to the student's department and semester
        const exams = await Exam.find({
            department: student.department,
            semester: student.semester
        })
        .populate("course", "title courseCode")
        .sort({ date: 1, startTime: 1 });
        
        res.status(200).json({ count: exams.length, exams });
    } catch (error) {
        console.error("Get Exams Error:", error);
        res.status(500).json({ message: "Server error while fetching exams" });
    }
};

// ==================== COURSE REGISTRATION ====================

// @desc    Get all available courses (for browsing/registration)
// @route   GET /api/student/all-courses
// @access  Private/Student
const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find()
            .populate("faculty", "name email department")
            .sort({ courseCode: 1 });
        
        // Get student's existing enrollments
        const enrollments = await Enrollment.find({ 
            student: req.user._id, 
            status: "enrolled" 
        }).select("course");
        
        const enrolledCourseIds = enrollments.map(e => e.course.toString());
        
        // Mark which courses the student is enrolled in
        const coursesWithStatus = courses.map(course => ({
            ...course.toObject(),
            isEnrolled: enrolledCourseIds.includes(course._id.toString()),
        }));
        
        res.status(200).json({ count: coursesWithStatus.length, courses: coursesWithStatus });
    } catch (error) {
        console.error("Get All Courses Error:", error);
        res.status(500).json({ message: "Server error while fetching courses" });
    }
};

// @desc    Enroll in a course
// @route   POST /api/student/enroll
// @access  Private/Student
const enrollCourse = async (req, res) => {
    try {
        const { courseId } = req.body;
        
        if (!courseId) {
            return res.status(400).json({ message: "Course ID is required" });
        }
        
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        
        // Check if already enrolled
        const existing = await Enrollment.findOne({ 
            student: req.user._id, 
            course: courseId, 
            status: "enrolled" 
        });
        
        if (existing) {
            return res.status(400).json({ message: "Already enrolled in this course" });
        }
        
        // Check if previously dropped — reactivate
        const dropped = await Enrollment.findOne({ 
            student: req.user._id, 
            course: courseId, 
            status: "dropped" 
        });
        
        if (dropped) {
            dropped.status = "enrolled";
            await dropped.save();
            return res.status(200).json({ message: "Re-enrolled successfully", enrollment: dropped });
        }
        
        const enrollment = await Enrollment.create({
            student: req.user._id,
            course: courseId,
        });
        
        res.status(201).json({ message: "Enrolled successfully", enrollment });
    } catch (error) {
        console.error("Enroll Course Error:", error);
        res.status(500).json({ message: "Server error while enrolling" });
    }
};

// @desc    Drop a course (unenroll)
// @route   DELETE /api/student/enroll/:courseId
// @access  Private/Student
const dropCourse = async (req, res) => {
    try {
        const enrollment = await Enrollment.findOne({
            student: req.user._id,
            course: req.params.courseId,
            status: "enrolled",
        });
        
        if (!enrollment) {
            return res.status(404).json({ message: "Enrollment not found" });
        }
        
        enrollment.status = "dropped";
        await enrollment.save();
        
        res.status(200).json({ message: "Course dropped successfully" });
    } catch (error) {
        console.error("Drop Course Error:", error);
        res.status(500).json({ message: "Server error while dropping course" });
    }
};

// @desc    Get student's enrolled courses
// @route   GET /api/student/enrolled
// @access  Private/Student
const getEnrolledCourses = async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ 
            student: req.user._id, 
            status: "enrolled" 
        })
        .populate({
            path: "course",
            populate: { path: "faculty", select: "name email" }
        })
        .sort({ createdAt: -1 });
        
        const courses = enrollments
            .filter(e => e.course)
            .map(e => e.course);
        
        res.status(200).json({ count: courses.length, courses });
    } catch (error) {
        console.error("Get Enrolled Courses Error:", error);
        res.status(500).json({ message: "Server error while fetching enrolled courses" });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    getAttendance,
    getResults,
    getNotifications,
    submitGrievance,
    getGrievances,
    getDashboardStats,
    requestGatepass,
    getGatepasses,
    getFees,
    getCourses,
    getExams,
    getAllCourses,
    enrollCourse,
    dropCourse,
    getEnrolledCourses,
};
