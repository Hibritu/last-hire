'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserJobFavorites', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      job_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Jobs',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Add unique constraint
    await queryInterface.addIndex('UserJobFavorites', ['user_id', 'job_id'], {
      unique: true,
      name: 'user_job_favorite_unique',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UserJobFavorites');
  }
};
