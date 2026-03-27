const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Timetable = require("./models/Timetable");
require("./models/Course");

dotenv.config();

const fixWednesday = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const result = await Timetable.updateMany(
            { day: "Wednesday", department: "Computer Science" },
            { $set: { department: "CSE" } }
        );
        console.log(`Matched ${result.matchedCount} and modified ${result.modifiedCount} entries.`);
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

fixWednesday();
