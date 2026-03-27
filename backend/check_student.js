const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");

dotenv.config();

const checkStudent = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const students = await User.find({ role: "student" });
        console.log(`Found ${students.length} students.`);
        students.forEach(s => {
            console.log(`Email: ${s.email}, Dept: ${s.department}, Sem: ${s.semester}`);
        });
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

checkStudent();
