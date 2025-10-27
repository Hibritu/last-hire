const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

// Check if DATABASE_URL is set for PostgreSQL (production)
// Otherwise, use SQLite for local development
const databaseUrl = process.env.DATABASE_URL;

let sequelize;

if (databaseUrl) {
  // Production: Use PostgreSQL (Neon DB)
  console.log('📦 Using PostgreSQL database (Neon DB)');
  sequelize = new Sequelize(databaseUrl, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
      connectTimeout: 30000, // 30 seconds
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    retry: {
      max: 3,
    },
    logging: false,
  });
} else {
  // Development: Use SQLite
  console.log('📦 Using SQLite database (development mode)');
  const dbPath = path.join(__dirname, '../../database.sqlite');
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
    logging: false,
  });
}

module.exports = { sequelize };
