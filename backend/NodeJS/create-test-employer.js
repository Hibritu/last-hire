// Quick script to create a test employer profile
require('dotenv').config();
const { sequelize } = require('./src/config/db');
const { User, EmployerProfile } = require('./src/models');

async function createTestEmployer() {
  try {
    await sequelize.authenticate();
    console.log('Database connected');

    // Create test user
    const [user, userCreated] = await User.findOrCreate({
      where: { email: 'employer@test.com' },
      defaults: {
        email: 'employer@test.com',
        password: '$2b$12$testpasswordhash', // Dummy hash
        role: 'employer',
        first_name: 'Test',
        last_name: 'Employer'
      }
    });
    console.log(userCreated ? '✅ Created test user' : '✅ Test user already exists');

    // Create employer profile
    const [employer, empCreated] = await EmployerProfile.findOrCreate({
      where: { user_id: user.id },
      defaults: {
        user_id: user.id,
        company_name: 'Test Company',
        type: 'private',
        sector: 'technology',
        description: 'Test company for development',
        verification_status: 'verified'
      }
    });
    console.log(empCreated ? '✅ Created employer profile' : '✅ Employer profile already exists');
    console.log(`\n🎉 Success! You can now post jobs as:`);
    console.log(`   Email: employer@test.com`);
    console.log(`   Company: ${employer.company_name}`);
    console.log(`   Employer ID: ${employer.id}\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createTestEmployer();

