// Check employers in database
require('dotenv').config();
const { sequelize } = require('./src/config/db');
const { EmployerProfile, User } = require('./src/models');

(async () => {
  try {
    await sequelize.authenticate();
    
    const employers = await EmployerProfile.findAll();
    console.log(`\n✅ Found ${employers.length} employer profile(s):\n`);
    
    for (const emp of employers) {
      console.log(`  Company: ${emp.company_name}`);
      console.log(`  ID: ${emp.id}`);
      console.log(`  User ID: ${emp.user_id}`);
      console.log(`  Type: ${emp.type}`);
      console.log(`  ---`);
    }
    
    const users = await User.findAll({ where: { role: 'employer' } });
    console.log(`\n✅ Found ${users.length} employer user(s):\n`);
    for (const user of users) {
      console.log(`  Email: ${user.email}`);
      console.log(`  ID: ${user.id}`);
      console.log(`  Name: ${user.first_name} ${user.last_name}`);
      console.log(`  ---`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
})();


