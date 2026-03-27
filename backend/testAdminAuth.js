const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");

dotenv.config();

const testAuth = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/edusphere");
        
        const admin = await User.findOne({ email: "admin@edusphere.com" });
        if (!admin) {
            console.log("Admin not found in DB");
            process.exit(1);
        }
        
        console.log("Admin found:", admin.email);
        console.log("Admin password hash:", admin.password);
        
        const isMatch = await admin.matchPassword("password123");
        console.log("Password match result for 'password123':", isMatch);
        
        process.exit(0);
    } catch (error) {
        console.error("Test failed:", error);
        process.exit(1);
    }
};

testAuth();
