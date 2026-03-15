const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Notification title is required"],
            trim: true,
        },
        message: {
            type: String,
            required: [true, "Message is required"],
            trim: true,
        },
        type: {
            type: String,
            enum: ["announcement", "exam", "holiday", "deadline", "general"],
            default: "general",
        },
        targetRole: {
            type: String,
            enum: ["all", "student", "faculty", "admin"],
            default: "all",
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);
// exports module
module.exports = mongoose.model("Notification", notificationSchema);
