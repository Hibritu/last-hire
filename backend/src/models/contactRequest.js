const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ContactRequest = sequelize.define('ContactRequest', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    freelancer_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    sender_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sender_email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending',
      allowNull: false,
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
    tableName: 'contact_requests',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  return ContactRequest;
};
