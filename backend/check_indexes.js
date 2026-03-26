const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const checkIndexes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    const indexes = await User.collection.indexes();
    
    console.log('Indexes on User collection:');
    console.log(JSON.stringify(indexes, null, 2));
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
  }
};

checkIndexes();
