const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Timetable = require("./models/Timetable");

dotenv.config();

const normalizeDays = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const entries = await Timetable.find({});
        console.log(`Found ${entries.length} total entries.`);

        let updatedCount = 0;
        for (const entry of entries) {
            const originalDay = entry.day;
            const normalizedDay = originalDay.trim();
            
            // Also ensure first letter is capitalized and rest lowercase if needed, 
            // but the enum is "Wednesday", so just trim first.
            if (originalDay !== normalizedDay) {
                entry.day = normalizedDay;
                await entry.save();
                updatedCount++;
                console.log(`Updated entry ${entry._id} from "${originalDay}" to "${normalizedDay}"`);
            }
        }

        console.log(`Finished. Updated ${updatedCount} entries.`);
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

normalizeDays();
