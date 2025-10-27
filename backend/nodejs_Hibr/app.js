// backend/NodeJS/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./src/config/db');
require('./src/models'); // initializes models and associations
const setupSwagger = require('./src/swagger');

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
app.use('/uploads', express.static(require('path').join(process.cwd(), 'uploads')));

// Swagger docs
setupSwagger(app);

app.get('/', (req, res) => {
  res.json({
    name: 'HireHub API',
    status: 'ok',
    endpoints: ['/health', '/auth/*', '/users/*', '/employers/*'],
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Routes
app.use('/auth', require('./src/routes/auth'));
app.use('/users', require('./src/routes/users'));
app.use('/employers', require('./src/routes/employers'));

async function start() {
  try {
    await sequelize.authenticate();
    // Note: for production use migrations; alter is fine for early development
    await sequelize.sync({ alter: true });

    const port = process.env.PORT || 4000;
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