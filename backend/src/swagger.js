const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'HireHub API',
      version: '1.0.0',
      description: 'HireHub API Documentation',
      contact: {
        name: 'HireHub Support',
        email: 'support@hirehub.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Development server'
      },
      {
        url: 'https://api.hirehub.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['email', 'password', 'first_name', 'last_name'],
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', writeOnly: true },
            first_name: { type: 'string' },
            last_name: { type: 'string' },
            phone: { type: 'string' },
            role: { 
              type: 'string', 
              enum: ['admin', 'employer', 'job_seeker'],
              default: 'job_seeker'
            },
            is_email_verified: { type: 'boolean', default: false },
            profile_picture: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        Job: {
          type: 'object',
          required: ['title', 'description', 'requirements', 'employment_type', 'location'],
          properties: {
            id: { type: 'string', format: 'uuid' },
            employer_id: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            description: { type: 'string' },
            requirements: { type: 'string' },
            category: { type: 'string' },
            employment_type: { 
              type: 'string', 
              enum: ['full-time', 'part-time', 'contract', 'internship']
            },
            location: { type: 'string' },
            salary: { type: 'number' },
            vacancies: { type: 'integer' },
            listing_type: { 
              type: 'string', 
              enum: ['free', 'premium'],
              default: 'free'
            },
            status: { 
              type: 'string', 
              enum: ['pending', 'approved', 'rejected', 'closed'],
              default: 'pending'
            },
            expiry_date: { type: 'string', format: 'date' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        Application: {
          type: 'object',
          required: ['job_id', 'user_id'],
          properties: {
            id: { type: 'string', format: 'uuid' },
            job_id: { type: 'string', format: 'uuid' },
            user_id: { type: 'string', format: 'uuid' },
            resume: { type: 'string' },
            cover_letter: { type: 'string' },
            status: { 
              type: 'string', 
              enum: ['submitted', 'shortlisted', 'accepted', 'rejected'],
              default: 'submitted'
            },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            status: { type: 'string' },
            message: { type: 'string' },
            errors: { 
              type: 'array',
              items: { type: 'string' }
            }
          }
        }
      },
      security: [
        {
          bearerAuth: []
        }
      ]
    }
  },
  apis: [
    './src/routes/*.js',
    './src/controllers/*.js'
  ]
};

const specs = swaggerJsdoc(options);

function setupSwagger(app) {
  // Swagger UI
  app.use('/api-docs', 
    swaggerUi.serve, 
    swaggerUi.setup(specs, { 
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'HireHub API Documentation'
    })
  );

  // Docs in JSON format
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });

  console.log('📚 API documentation available at /api-docs');
}

module.exports = setupSwagger;
