const { User, EmployerProfile, Job, Application, FreelancerProfile } = require('../models');
const bcrypt = require('bcrypt');

async function seedChatTestData() {
  try {
    console.log('🚀 Starting chat test data seeding...');

    // Create employer user
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const [employer, employerCreated] = await User.findOrCreate({
      where: { email: 'employer.test@hirehub.com' },
      defaults: {
        role: 'employer',
        email: 'employer.test@hirehub.com',
        phone: '+251911111111',
        password: hashedPassword,
        first_name: 'Test',
        last_name: 'Employer',
        gender: 'male',
        is_verified: true,
      }
    });

    // Create employer profile
    const [employerProfile, empProfileCreated] = await EmployerProfile.findOrCreate({
      where: { user_id: employer.id },
      defaults: {
        user_id: employer.id,
        type: 'company',
        company_name: 'TechCorp Solutions',
        sector: 'Technology',
        address: 'Addis Ababa, Ethiopia',
        phone: '+251911111111',
        website: 'https://techcorp.com',
        category: 'it',
        verification_status: 'verified',
      }
    });

    // Create job seeker user
    const [jobSeeker, jobSeekerCreated] = await User.findOrCreate({
      where: { email: 'jobseeker.test@hirehub.com' },
      defaults: {
        role: 'job_seeker',
        email: 'jobseeker.test@hirehub.com',
        phone: '+251922222222',
        password: hashedPassword,
        first_name: 'Test',
        last_name: 'JobSeeker',
        gender: 'female',
        preferred_categories: ['programming', 'engineering'],
        preferred_locations: ['Addis Ababa, Ethiopia'],
        is_verified: true,
      }
    });

    // Create freelancer profile
    const [freelancerProfile, freProfileCreated] = await FreelancerProfile.findOrCreate({
      where: { user_id: jobSeeker.id },
      defaults: {
        user_id: jobSeeker.id,
        title: 'Senior Full-Stack Developer',
        description: 'Experienced developer specializing in modern web technologies',
        hourly_rate: 2000.00,
        availability: 'available',
        skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
        languages: ['English', 'Amharic'],
        experience_years: 4,
        completed_projects: 15,
        rating: 4.8,
        total_reviews: 45,
        is_verified: true,
      }
    });

    // Create a job posting
    const job = await Job.create({
      employer_id: employerProfile.id,
      title: 'Senior React Developer',
      description: 'We are looking for an experienced React developer to join our team and work on exciting projects.',
      requirements: 'Minimum 3 years experience with React, Node.js, and TypeScript. Experience with PostgreSQL preferred.',
      category: 'programming',
      employment_type: 'full-time',
      location: 'Addis Ababa, Ethiopia',
      salary: 45000,
      expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      listing_type: 'free',
      status: 'approved',
    });

    // Create an application with shortlisted status (required for chat)
    const application = await Application.create({
      job_id: job.id,
      user_id: jobSeeker.id,
      status: 'shortlisted', // This allows chat creation
      cover_letter: 'I am very interested in this position and believe my skills align perfectly with your requirements.',
    });

    console.log('✅ Chat test data created successfully!');
    console.log('\n📋 Test Data Summary:');
    console.log(`👤 Employer: ${employer.email} (ID: ${employer.id})`);
    console.log(`👤 Job Seeker: ${jobSeeker.email} (ID: ${jobSeeker.id})`);
    console.log(`💼 Job: ${job.title} (ID: ${job.id})`);
    console.log(`📄 Application: ${application.id} (Status: ${application.status})`);
    console.log('\n🔗 Use this Application ID in Swagger to test chat:');
    console.log(`Application ID: ${application.id}`);
    console.log('\n🔑 Login credentials for testing:');
    console.log('Employer: employer.test@hirehub.com / password123');
    console.log('Job Seeker: jobseeker.test@hirehub.com / password123');

    return {
      employer,
      jobSeeker,
      job,
      application,
      employerProfile,
      freelancerProfile
    };

  } catch (error) {
    console.error('❌ Chat test data seeding failed:', error);
    throw error;
  }
}

// Run seeder if called directly
if (require.main === module) {
  const { sequelize } = require('../config/db');
  
  sequelize.authenticate()
    .then(() => {
      console.log('📡 Database connected');
      return seedChatTestData();
    })
    .then(() => {
      console.log('🎉 Chat test data seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedChatTestData };
