require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Create admin user
const createAdmin = async () => {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'instructor@tunisianCareerAcademy.com' });

    if (adminExists) {
      console.log('Admin user already exists');
      return;
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin@123', salt);
    
    // Create new admin user
    const admin = new User({
      name: 'Admin User',
      email: 'instructor@tunisianCareerAcademy.com',
      password: hashedPassword,
      role: 'instructor',
      authProvider: 'email',
      location: 'tunisia',
      bio: 'System administrator for tunisianCareerAcademy.com',
      isVerified: true
    });
    
    await admin.save();
    console.log('Admin user created successfully:');
    console.log('Email: admin@tunisianCareerAcademy.com');
    console.log('Password: Admin@123');
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

// Seed data
const seedData = async () => {
  try {
    await connectDB();
    await createAdmin();
    
    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

// Run the seeder
seedData(); 