const mongoose = require("mongoose");

const gatepassSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        type: {
            type: String,
            enum: ["outing", "home"],
            required: true,
        },
        reason: {
            type: String,
            required: true,
        },
        outDate: {
            type: Date,
            required: true,
        },
        inDate: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: [
                "pending_parent",
                "approved_by_parent",
                "rejected_by_parent",
                "approved_by_warden",
                "rejected_by_warden",
            ],
            default: "pending_parent",
        },
        warden: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        comments: String,
    },
    {
        timestamps: true,
    }
);
// exports module
module.exports = mongoose.model("Gatepass", gatepassSchema);
