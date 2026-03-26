const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');

dotenv.config({ path: path.join(__dirname, '.env') });

const testCreateParent = async () => {
  try {
    console.log('Finding admin user...');
    const mongoose = require('mongoose');
    await mongoose.connect(process.env.MONGO_URI);
    const User = mongoose.model('User', new mongoose.Schema({ role: String }));
    const admin = await User.findOne({ role: 'admin' });
    
    if (!admin) {
        console.error('No admin found in database. Cannot test.');
        process.exit(1);
    }
    
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log(`Using Admin: ${admin.email}`);
    
    const studentEmail = '2301010298@edusphere.com';
    const parentData = JSON.stringify({
        name: 'Baljeet Singh',
        email: studentEmail,
        password: 'password123',
        role: 'parent',
        phone: '9992777400',
        student: '69c3a04ac26ff2e42657fa99'
    });
    
    const options = {
        hostname: 'localhost',
        port: 5001,
        path: '/api/admin/users',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': parentData.length,
            'Authorization': `Bearer ${token}`
        }
    };

    const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
            console.log('HTTP Status:', res.statusCode);
            console.log('Response:', data);
            mongoose.connection.close();
        });
    });

    req.on('error', (error) => {
        console.error('Request Error:', error);
        mongoose.connection.close();
    });

    req.write(parentData);
    req.end();
  } catch (error) {
    console.error('Test script error:', error);
  }
};

testCreateParent();
