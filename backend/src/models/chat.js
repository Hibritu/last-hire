// src/models/chat.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Chat = sequelize.define('Chat', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    application_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    employer_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    jobseeker_id: {
      type: DataTypes.UUID,
      allowNull: false
    }
  }, {
    tableName: 'chats',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Chat;
};
