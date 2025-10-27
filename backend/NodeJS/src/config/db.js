const { Sequelize } = require('sequelize');
require('dotenv').config();

// Use SQLite for local development instead of PostgreSQL
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database_jobs.sqlite',
  logging: false,
});

module.exports = { sequelize };
