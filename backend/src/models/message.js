// src/models/message.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Message = sequelize.define('Message', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    chat_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    sender_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    file_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'messages',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Message;
};
