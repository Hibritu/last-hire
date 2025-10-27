const { User, FreelancerProfile, EmployerProfile } = require('./src/models');

async function clearSeededData() {
  try {
    console.log('🧹 Clearing seeded data...');
    
    // Delete freelancer profiles first (due to foreign key constraints)
    await FreelancerProfile.destroy({ where: {} });
    console.log('✅ Cleared freelancer profiles');
    
    // Delete employer profiles
    await EmployerProfile.destroy({ where: {} });
    console.log('✅ Cleared employer profiles');
    
    // Delete users (this will cascade to related data)
    await User.destroy({ where: {} });
    console.log('✅ Cleared users');
    
    console.log('🎉 All seeded data cleared successfully!');
  } catch (error) {
    console.error('❌ Error clearing data:', error);
  }
}

// Run if called directly
if (require.main === module) {
  clearSeededData()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { clearSeededData };
