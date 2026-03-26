const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const findUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Using a dynamic schema to find anyone
    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    const users = await User.find({ email: '2301010298@edusphere.com' });
    
    console.log('Users found with email 2301010298@edusphere.com:');
    console.log(JSON.stringify(users, null, 2));
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
  }
};

findUser();
