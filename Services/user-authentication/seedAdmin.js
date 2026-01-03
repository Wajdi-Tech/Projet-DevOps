const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/authentication-service');
        console.log('Connected to MongoDB');

        const adminExists = await User.findOne({ email: 'wajdi@tech.com' });
        if (adminExists) {
            console.log('Admin user already exists');
            process.exit(0);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('0000', salt);

        const admin = new User({
            firstName: 'wajdi',
            lastName: 'wajdi',
            email: 'wajdi@tech.com',
            password: hashedPassword,
            role: 'admin',
        });

        await admin.save();
        console.log('Admin user created successfully');
        process.exit(0);
    } catch (err) {
        console.error('Error creating admin user:', err);
        process.exit(1);
    }
};

createAdmin();
