// swagger.ts (in project root)
import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'COEEC API - ASTU',
      version: '1.0.0',
      description: 'College of Electrical Engineering and Computing Backend',
    },
    servers: [
      { url: 'http://localhost:5000', description: 'Development server' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/modules/**/*.routes.ts'],
};

export const specs = swaggerJSDoc(options);