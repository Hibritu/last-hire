const { sequelize } = require('./src/config/db');

sequelize.authenticate()
  .then(() => {
    console.log('Auth service database connection successful');
    return sequelize.close();
  })
  .catch(err => {
    console.error('Auth service database connection failed:', err);
  });