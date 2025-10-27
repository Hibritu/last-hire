// backend/NodeJS/app.js
require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./src/config/db');
require('./src/models'); // initializes models and associations

const swaggerUi = require('swagger-ui-express');
const { swaggerSpec } = require('./src/docs/swagger');

// Debug: Log the PORT environment variable
console.log('PORT from environment:', process.env.PORT);

const app = express();

// CORS configuration for multiple frontend origins
const corsOptions = {
  origin: [
    'http://localhost:8081',  // USER(dagi) app
    'http://localhost:3002',  // Seekr Companion (Auth Hub)
    'http://localhost:3000',  // Employer(employer-connect-pro) app
    'http://localhost:3001',  // Admin panel
    'http://127.0.0.1:8081',
    'http://127.0.0.1:3002', 
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));
app.use(express.json());

// Swagger UI first to avoid conflict with '/api/:id' routes
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Mount Developer 2 routes
app.use('/api/jobs', require('./src/routes/jobs'));
app.use('/api', require('./src/routes/applications'));
app.use('/api', require('./src/routes/reports'));
app.use('/api', require('./src/routes/admin'));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' }); 
});

async function start() {
  try {
    await sequelize.authenticate();
    // Use plain sync to avoid risky ALTERs in production; switch to migrations later
    await sequelize.sync();

    const port = process.env.PORT || 4000;
    console.log('Starting server on port:', port);
    app.listen(port, () => console.log(`API running on http://localhost:${port}`));
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  start();
}

module.exports = { app, start };