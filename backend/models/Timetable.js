const mongoose = require("mongoose");

const timetableEntrySchema = new mongoose.Schema(
    {
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        department: {
            type: String,
            required: true,
        },
        semester: {
            type: Number,
            required: true,
        },
        day: {
            type: String,
            enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            required: true,
        },
        startTime: {
            type: String, // e.g., "10:00 AM"
            required: true,
        },
        endTime: {
            type: String, // e.g., "11:00 AM"
            required: true,
        },
        roomContext: {
            type: String, // e.g. "Room 402" or "Lab 1"
        },
    },
    {
        timestamps: true,
    }
);
// exports module
module.exports = mongoose.model("Timetable", timetableEntrySchema);
