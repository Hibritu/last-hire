const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserJobFavorite = sequelize.define('UserJobFavorite', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    job_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'UserJobFavorites',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'job_id'],
        name: 'user_job_favorite_unique',
      },
    ],
  });

  return UserJobFavorite;
};
