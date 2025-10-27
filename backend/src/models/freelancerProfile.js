const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const FreelancerProfile = sequelize.define('FreelancerProfile', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    hourly_rate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    availability: {
      type: DataTypes.ENUM('available', 'busy', 'unavailable'),
      defaultValue: 'available',
    },
    skills: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: true,
      defaultValue: [],
    },
    languages: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: true,
      defaultValue: [],
    },
    experience_years: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    completed_projects: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,
      defaultValue: 0.00,
    },
    total_reviews: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    portfolio_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    linkedin_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    github_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    website_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'freelancer_profiles',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  return FreelancerProfile;
};
