const { sequelize } = require('./src/config/db');

sequelize.authenticate()
  .then(() => {
    console.log('Jobs service database connection successful');
    return sequelize.close();
  })
  .catch(err => {
    console.error('Jobs service database connection failed:', err);
  });