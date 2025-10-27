'use strict';
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if admin already exists
    const existingAdmin = await queryInterface.sequelize.query(
      `SELECT id FROM "Users" WHERE email = 'admin@hirehub.com' LIMIT 1;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (existingAdmin.length > 0) {
      console.log('Admin user already exists, skipping seeder');
      return;
    }

    // Hash the default admin password
    const hashedPassword = await bcrypt.hash('Admin@123456', 10);

    // Create admin user
    await queryInterface.bulkInsert('Users', [
      {
        id: uuidv4(),
        role: 'admin',
        email: 'admin@hirehub.com',
        phone: '+251911000000',
        password: hashedPassword,
        first_name: 'System',
        last_name: 'Administrator',
        gender: 'male',
        email_verified: true,
        email_otp: null,
        email_otp_expires_at: null,
        reset_token: null,
        reset_token_expires_at: null,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@hirehub.com');
    console.log('🔑 Password: Admin@123456');
    console.log('⚠️  Please change the password after first login!');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', {
      email: 'admin@hirehub.com'
    }, {});
  }
};
