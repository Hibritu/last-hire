/**
 * Quick script to create an admin user for HireHub
 * Run: node backend/create-admin.js
 */

require('dotenv').config();
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const { sequelize } = require('./src/config/db');
const { User } = require('./src/models');

async function createAdmin() {
  try {
    console.log('🔧 Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Database connected!');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ where: { email: 'admin@hirehub.et' } });
    
    if (existingAdmin) {
      console.log('⚠️ Admin user already exists!');
      console.log('📧 Email: admin@hirehub.et');
      console.log('🔐 Password: admin123');
      console.log('\n💡 Updating role to admin...');
      existingAdmin.role = 'admin';
      existingAdmin.is_verified = true;
      await existingAdmin.save();
      console.log('✅ User updated to admin!');
    } else {
      console.log('👤 Creating new admin user...');
      
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const admin = await User.create({
        id: uuidv4(),
        email: 'admin@hirehub.et',
        password: hashedPassword,
        role: 'admin',
        first_name: 'Admin',
        last_name: 'User',
        is_verified: true,
        is_active: true
      });

      console.log('✅ Admin user created successfully!');
      console.log('\n📋 Admin Credentials:');
      console.log('📧 Email: admin@hirehub.et');
      console.log('🔐 Password: admin123');
      console.log('\n🌐 Login at:');
      console.log('   - Auth Hub: http://localhost:3002/login');
      console.log('   - Admin Panel: http://localhost:3001');
    }

    console.log('\n✅ Done!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createAdmin();

