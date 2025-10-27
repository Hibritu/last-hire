const { User, EmployerProfile, Job, Application, FreelancerProfile } = require('./src/models');
const bcrypt = require('bcrypt');

async function createTestData() {
  try {
    console.log('🚀 Creating test data for chat...');

    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create or find employer
    const [employer] = await User.findOrCreate({
      where: { email: 'employer.test@hirehub.com' },
      defaults: {
        role: 'employer',
        email: 'employer.test@hirehub.com',
        phone: '+251911111111',
        password: hashedPassword,
        first_name: 'Test',
        last_name: 'Employer',
        is_verified: true,
      }
    });

    // Create or find employer profile
    const [employerProfile] = await EmployerProfile.findOrCreate({
      where: { user_id: employer.id },
      defaults: {
        user_id: employer.id,
        type: 'company',
        company_name: 'TechCorp Solutions',
        sector: 'Technology',
        verification_status: 'verified',
      }
    });

    // Create or find job seeker
    const [jobSeeker] = await User.findOrCreate({
      where: { email: 'jobseeker.test@hirehub.com' },
      defaults: {
        role: 'job_seeker',
        email: 'jobseeker.test@hirehub.com',
        phone: '+251922222222',
        password: hashedPassword,
        first_name: 'Test',
        last_name: 'JobSeeker',
        is_verified: true,
      }
    });

    // Create job
    const job = await Job.create({
      employer_id: employerProfile.id,
      title: 'Senior React Developer',
      description: 'Looking for an experienced React developer',
      category: 'programming',
      employment_type: 'full-time',
      location: 'Addis Ababa',
      salary: 45000,
      expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'approved',
    });

    // Create application with shortlisted status
    const application = await Application.create({
      job_id: job.id,
      user_id: jobSeeker.id,
      status: 'shortlisted', // Required for chat
      cover_letter: 'I am interested in this position.',
    });

    console.log('✅ Test data created successfully!');
    console.log('\n📋 Use these credentials in Swagger:');
    console.log('🔑 Employer Login: employer.test@hirehub.com / password123');
    console.log('🔑 Job Seeker Login: jobseeker.test@hirehub.com / password123');
    console.log(`\n📄 Application ID for chat testing: ${application.id}`);
    console.log(`💼 Job ID: ${job.id}`);
    
    return { employer, jobSeeker, job, application };

  } catch (error) {
    console.error('❌ Error creating test data:', error);
  }
}

if (require.main === module) {
  const { sequelize } = require('./src/config/db');
  
  sequelize.authenticate()
    .then(() => createTestData())
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = { createTestData };
