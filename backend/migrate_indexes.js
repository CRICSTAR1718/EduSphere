const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const migrateIndexes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    // Get the User collection directly
    const collection = mongoose.connection.collection('users');
    
    console.log('--- Current Indexes ---');
    const oldIndexes = await collection.indexes();
    console.log(JSON.stringify(oldIndexes, null, 2));

    // 1. Drop the existing single-field unique index on email
    // The name is usually 'email_1'
    try {
      console.log('Dropping index: email_1...');
      await collection.dropIndex('email_1');
      console.log('✅ Successfully dropped email_1 index');
    } catch (err) {
      if (err.codeName === 'IndexNotFound' || err.message.includes('not found')) {
        console.log('⚠️ index email_1 not found, skipping drop...');
      } else {
        throw err;
      }
    }

    // 2. Create the new unique compound index on { email: 1, role: 1 }
    console.log('Creating unique compound index on { email: 1, role: 1 }...');
    await collection.createIndex({ email: 1, role: 1 }, { unique: true });
    console.log('✅ Successfully created compound index');

    console.log('--- New Indexes ---');
    const newIndexes = await collection.indexes();
    console.log(JSON.stringify(newIndexes, null, 2));
    
    await mongoose.connection.close();
    console.log('👋 Migration complete, connection closed');
  } catch (error) {
    console.error('❌ Migration Error:', error);
    process.exit(1);
  }
};

migrateIndexes();
