'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('freelancer_profiles', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      hourly_rate: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      availability: {
        type: Sequelize.ENUM('available', 'busy', 'unavailable'),
        defaultValue: 'available',
      },
      skills: {
        type: Sequelize.ARRAY(Sequelize.TEXT),
        allowNull: true,
        defaultValue: [],
      },
      languages: {
        type: Sequelize.ARRAY(Sequelize.TEXT),
        allowNull: true,
        defaultValue: [],
      },
      experience_years: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      completed_projects: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      rating: {
        type: Sequelize.DECIMAL(3, 2),
        allowNull: true,
        defaultValue: 0.00,
      },
      total_reviews: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      portfolio_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      linkedin_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      github_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      website_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      is_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      is_featured: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Add unique constraint on user_id
    await queryInterface.addConstraint('freelancer_profiles', {
      fields: ['user_id'],
      type: 'unique',
      name: 'unique_freelancer_user_id',
    });

    // Add index on skills for better search performance
    await queryInterface.addIndex('freelancer_profiles', ['skills'], {
      name: 'idx_freelancer_skills',
      using: 'gin',
    });

    // Add index on availability
    await queryInterface.addIndex('freelancer_profiles', ['availability'], {
      name: 'idx_freelancer_availability',
    });

    // Add index on rating
    await queryInterface.addIndex('freelancer_profiles', ['rating'], {
      name: 'idx_freelancer_rating',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('freelancer_profiles');
  }
};
