const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

dotenv.config();

const app = express();

connectDB();

app.use(express.json());

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My Authentication API',
      version: '1.0.0',
      description: 'API documentation for the Authentication and Protected routes project, generated with Swagger.',
      contact: {
        name: 'Your Name/Team',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      }
    },
  },
  apis: [
    path.resolve(__dirname, './routes/auth.js'),
    path.resolve(__dirname, './routes/protected.js'),
    path.resolve(__dirname, './index.js')
  ],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);

/**
 * @swagger
 * /:
 *   get:
 *     summary: Server health check
 *     tags: [General]
 *     description: Returns a message indicating the API is running.
 *     responses:
 *       200:
 *         description: API is running.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Authentication API is running
 */
app.get('/', (req, res) => {
  res.send('Authentication API is running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
});