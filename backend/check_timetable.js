const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Timetable = require("./models/Timetable");
require("./models/Course");

dotenv.config();

const checkTimetable = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const entries = await Timetable.find({ day: "Wednesday" }).populate("course");
        console.log(`Found ${entries.length} Wednesday entries.`);
        console.log(JSON.stringify(entries, null, 2));
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

checkTimetable();
