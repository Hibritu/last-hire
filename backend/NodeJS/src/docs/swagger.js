const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'HireHub Ethiopia API',
      version: '1.0.0',
      description: 'API documentation for Jobs, Applications, Reports, and Admin endpoints',
    },
    servers: [{ url: `http://localhost:${process.env.PORT || 5000}/api` }],
    components: {
      securitySchemes: {
        XUserId: { type: 'apiKey', in: 'header', name: 'x-user-id' },
        XUserRole: { type: 'apiKey', in: 'header', name: 'x-user-role' },
      },
      schemas: {
        Job: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            employment_type: { type: 'string' },
            vacancies: { type: 'integer' },
            status: { type: 'string', enum: ['pending', 'approved', 'rejected', 'closed'] },
          },
        },
        Application: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            job_id: { type: 'string' },
            applicant_id: { type: 'string' },
            status: { type: 'string', enum: ['submitted','shortlisted','accepted','rejected'] },
          },
        },
        Report: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            job_id: { type: 'string' },
            reason: { type: 'string' },
            status: { type: 'string', enum: ['pending','reviewed','resolved'] },
          },
        },
      },
    },
    security: [{ XUserId: [], XUserRole: [] }],
  },
  apis: ['**/src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = { swaggerSpec };
