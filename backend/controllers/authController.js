const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role, phone, department, semester, enrollmentNo } = req.body;

        const userRole = role || "student";

        // Check if user already exists with SAME email AND role
        const existingUser = await User.findOne({ email, role: userRole });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email and role" });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            role: userRole,
            phone: phone || "",
            department: department || "",
            semester: semester || null,
            enrollmentNo: enrollmentNo || "",
        });

        // Generate token and respond
        const token = generateToken(user);

        res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                department: user.department,
                semester: user.semester,
                enrollmentNo: user.enrollmentNo,
            },
        });
    } catch (error) {
        console.error("Register error:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Login user & return JWT
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Find user by email AND role
        const query = { email };
        if (role) query.role = role;

        const user = await User.findOne(query);
        if (!user) {
            return res.status(401).json({ message: "Invalid email, password or role" });
        }

        // Check if account is active
        if (!user.isActive) {
            return res.status(403).json({ message: "Account is deactivated. Contact admin." });
        }

        // Verify password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate token and respond
        const token = generateToken(user);

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                department: user.department,
                semester: user.semester,
                enrollmentNo: user.enrollmentNo,
            },
        });
    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("GetMe error:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { registerUser, loginUser, getMe };
