const User = require("../models/User");

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
    try {
        const totalStudents = await User.countDocuments({ role: "student" });
        const totalFaculty = await User.countDocuments({ role: "faculty" });
        const totalAdmins = await User.countDocuments({ role: "admin" });
        
        // Return dummy stats for other entities for now
        res.status(200).json({
            stats: {
                totalStudents,
                totalFaculty,
                totalAdmins,
                totalCourses: 0, // Placeholder
                totalActiveExams: 0, // Placeholder
            }
        });
    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        res.status(500).json({ message: "Server error while fetching stats" });
    }
};

// @desc    Get all users (optionally filter by role)
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        const { role } = req.query;
        let query = {};
        
        if (role) {
            query.role = role;
        }

        const users = await User.find(query).select("-password").sort({ createdAt: -1 });
        
        res.status(200).json({
            count: users.length,
            users,
        });
    } catch (error) {
        console.error("Get Users Error:", error);
        res.status(500).json({ message: "Server error while fetching users" });
    }
};

// @desc    Create a new user (student, faculty, etc.)
// @route   POST /api/admin/users
// @access  Private/Admin
const createUser = async (req, res) => {
    try {
        const { name, email, password, role, phone, department, semester, enrollmentNo } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email and password are required" });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists with this email" });
        }

        const user = await User.create({
            name,
            email,
            password,
            role: role || "student",
            phone,
            department,
            semester,
            enrollmentNo,
        });

        if (user) {
            res.status(201).json({
                message: "User created successfully",
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                }
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        console.error("Create User Error:", error);
        res.status(500).json({ message: "Server error while creating user" });
    }
};

// @desc    Update user details
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
    try {
        const { name, email, role, phone, department, semester, enrollmentNo, isActive } = req.body;

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.name = name || user.name;
        user.email = email || user.email;
        if (role) user.role = role;
        user.phone = phone !== undefined ? phone : user.phone;
        user.department = department !== undefined ? department : user.department;
        user.semester = semester !== undefined ? semester : user.semester;
        user.enrollmentNo = enrollmentNo !== undefined ? enrollmentNo : user.enrollmentNo;
        if (isActive !== undefined) user.isActive = isActive;

        const updatedUser = await user.save();

        res.status(200).json({
            message: "User updated successfully",
            user: {
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                isActive: updatedUser.isActive
            }
        });
    } catch (error) {
        console.error("Update User Error:", error);
        res.status(500).json({ message: "Server error while updating user" });
    }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Prevent admin from deleting themselves
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: "Admin cannot delete their own account" });
        }

        await User.deleteOne({ _id: user._id });

        res.status(200).json({ message: "User removed successfully" });
    } catch (error) {
        console.error("Delete User Error:", error);
        res.status(500).json({ message: "Server error while deleting user" });
    }
};

module.exports = {
    getDashboardStats,
    getUsers,
    createUser,
    updateUser,
    deleteUser,
};
