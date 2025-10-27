const { User, FreelancerProfile } = require('../models');

const sampleFreelancers = [
  {
    user: {
      role: 'job_seeker',
      email: 'abel.tesfaye@example.com',
      phone: '+251911234567',
      password: '$2b$10$example.hash.here', // This would be hashed in real scenario
      first_name: 'Abel',
      last_name: 'Tesfaye',
      gender: 'male',
      preferred_categories: ['engineering', 'programming'],
      preferred_locations: ['Addis Ababa, Ethiopia'],
      is_verified: true,
    },
    profile: {
      title: 'Full-Stack Developer',
      description: 'Experienced full-stack developer with 5+ years of experience in React, Node.js, and Python. I specialize in building scalable web applications and have worked with various startups and enterprises.',
      hourly_rate: 1800.00,
      availability: 'available',
      skills: ['React', 'Node.js', 'Python', 'JavaScript', 'TypeScript', 'PostgreSQL', 'MongoDB', 'AWS'],
      languages: ['English', 'Amharic'],
      experience_years: 5,
      completed_projects: 25,
      rating: 4.9,
      total_reviews: 127,
      portfolio_url: 'https://abeltesfaye.dev',
      linkedin_url: 'https://linkedin.com/in/abeltesfaye',
      github_url: 'https://github.com/abeltesfaye',
      is_verified: true,
      is_featured: true,
    }
  },
  {
    user: {
      role: 'job_seeker',
      email: 'sara.alemayehu@example.com',
      phone: '+251911234568',
      password: '$2b$10$example.hash.here',
      first_name: 'Sara',
      last_name: 'Alemayehu',
      gender: 'female',
      preferred_categories: ['design'],
      preferred_locations: ['Addis Ababa, Ethiopia'],
      is_verified: true,
    },
    profile: {
      title: 'UI/UX Designer',
      description: 'Creative UI/UX designer passionate about creating beautiful and functional user experiences. I have worked on various mobile and web applications, helping businesses improve their user engagement.',
      hourly_rate: 1500.00,
      availability: 'available',
      skills: ['Figma', 'Adobe XD', 'Webflow', 'Sketch', 'Photoshop', 'Illustrator', 'Prototyping', 'User Research'],
      languages: ['English', 'Amharic'],
      experience_years: 3,
      completed_projects: 18,
      rating: 4.8,
      total_reviews: 89,
      portfolio_url: 'https://saraalemayehu.design',
      linkedin_url: 'https://linkedin.com/in/saraalemayehu',
      is_verified: true,
      is_featured: true,
    }
  },
  {
    user: {
      role: 'job_seeker',
      email: 'michael.tadesse@example.com',
      phone: '+251911234569',
      password: '$2b$10$example.hash.here',
      first_name: 'Michael',
      last_name: 'Tadesse',
      gender: 'male',
      preferred_categories: ['marketing'],
      preferred_locations: ['Addis Ababa, Ethiopia'],
      is_verified: true,
    },
    profile: {
      title: 'Digital Marketing Expert',
      description: 'Digital marketing specialist with expertise in SEO, Google Ads, and social media marketing. I help businesses increase their online presence and drive qualified traffic to their websites.',
      hourly_rate: 1200.00,
      availability: 'available',
      skills: ['SEO', 'Google Ads', 'Analytics', 'Social Media Marketing', 'Content Marketing', 'Email Marketing', 'PPC'],
      languages: ['English', 'Amharic'],
      experience_years: 4,
      completed_projects: 32,
      rating: 4.9,
      total_reviews: 156,
      portfolio_url: 'https://michaeltadesse.marketing',
      linkedin_url: 'https://linkedin.com/in/michaeltadesse',
      is_verified: true,
      is_featured: true,
    }
  },
  {
    user: {
      role: 'job_seeker',
      email: 'helen.getahun@example.com',
      phone: '+251911234570',
      password: '$2b$10$example.hash.here',
      first_name: 'Helen',
      last_name: 'Getahun',
      gender: 'female',
      preferred_categories: ['media'],
      preferred_locations: ['Bahir Dar, Ethiopia'],
      is_verified: true,
    },
    profile: {
      title: 'Content Writer',
      description: 'Professional content writer specializing in blog posts, articles, and marketing copy. I create engaging content that resonates with your target audience and drives conversions.',
      hourly_rate: 800.00,
      availability: 'available',
      skills: ['Content Writing', 'SEO Writing', 'Translation', 'Copywriting', 'Blog Writing', 'Technical Writing'],
      languages: ['English', 'Amharic', 'French'],
      experience_years: 2,
      completed_projects: 45,
      rating: 4.7,
      total_reviews: 78,
      portfolio_url: 'https://helengetahun.writer',
      linkedin_url: 'https://linkedin.com/in/helengetahun',
      is_verified: true,
    }
  },
  {
    user: {
      role: 'job_seeker',
      email: 'daniel.fekadu@example.com',
      phone: '+251911234571',
      password: '$2b$10$example.hash.here',
      first_name: 'Daniel',
      last_name: 'Fekadu',
      gender: 'male',
      preferred_categories: ['engineering', 'programming'],
      preferred_locations: ['Addis Ababa, Ethiopia'],
      is_verified: true,
    },
    profile: {
      title: 'Mobile App Developer',
      description: 'Mobile app developer specializing in Flutter and React Native. I create cross-platform mobile applications that provide excellent user experiences on both iOS and Android.',
      hourly_rate: 2000.00,
      availability: 'busy',
      skills: ['Flutter', 'React Native', 'iOS', 'Android', 'Dart', 'JavaScript', 'Firebase', 'REST APIs'],
      languages: ['English', 'Amharic'],
      experience_years: 4,
      completed_projects: 22,
      rating: 4.8,
      total_reviews: 94,
      portfolio_url: 'https://danielfekadu.dev',
      linkedin_url: 'https://linkedin.com/in/danielfekadu',
      github_url: 'https://github.com/danielfekadu',
      is_verified: true,
      is_featured: true,
    }
  },
  {
    user: {
      role: 'job_seeker',
      email: 'ruth.assefa@example.com',
      phone: '+251911234572',
      password: '$2b$10$example.hash.here',
      first_name: 'Ruth',
      last_name: 'Assefa',
      gender: 'female',
      preferred_categories: ['design'],
      preferred_locations: ['Dire Dawa, Ethiopia'],
      is_verified: true,
    },
    profile: {
      title: 'Graphic Designer',
      description: 'Creative graphic designer with expertise in branding, logo design, and print materials. I help businesses create memorable visual identities that stand out in the market.',
      hourly_rate: 900.00,
      availability: 'available',
      skills: ['Photoshop', 'Illustrator', 'Branding', 'Logo Design', 'Print Design', 'InDesign', 'Canva'],
      languages: ['English', 'Amharic'],
      experience_years: 3,
      completed_projects: 38,
      rating: 4.6,
      total_reviews: 132,
      portfolio_url: 'https://ruthassefa.design',
      linkedin_url: 'https://linkedin.com/in/ruthassefa',
      is_verified: true,
    }
  }
];

async function seedFreelancers() {
  try {
    console.log('🌱 Seeding freelancers...');

    for (const freelancerData of sampleFreelancers) {
      // Check if user already exists
      let user = await User.findOne({ where: { email: freelancerData.user.email } });
      
      if (!user) {
        // Create user
        user = await User.create(freelancerData.user);
        console.log(`✅ Created user: ${user.first_name} ${user.last_name}`);
      }

      // Check if freelancer profile already exists
      let freelancerProfile = await FreelancerProfile.findOne({ 
        where: { user_id: user.id } 
      });

      if (!freelancerProfile) {
        // Create freelancer profile
        freelancerProfile = await FreelancerProfile.create({
          ...freelancerData.profile,
          user_id: user.id,
        });
        console.log(`✅ Created freelancer profile: ${freelancerProfile.title}`);
      } else {
        console.log(`⚠️ Freelancer profile already exists for: ${user.first_name} ${user.last_name}`);
      }
    }

    console.log('🎉 Freelancer seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding freelancers:', error);
  }
}

// Run seeder if called directly
if (require.main === module) {
  seedFreelancers()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { seedFreelancers };
