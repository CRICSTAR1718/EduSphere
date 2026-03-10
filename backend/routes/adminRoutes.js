const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
const {
    getDashboardStats,
    getUsers,
    createUser,
    updateUser,
    deleteUser
} = require("../controllers/adminController");

// All routes below require: logged in + admin role
router.use(protect, authorize("admin"));

// Dashboard
router.get("/dashboard", getDashboardStats);

// User Management (CRUD)
router.route("/users")
    .get(getUsers)
    .post(createUser);

router.route("/users/:id")
    .put(updateUser)
    .delete(deleteUser);

module.exports = router;
