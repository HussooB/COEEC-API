// src/app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { specs } from './swagger.js';
import swaggerUi from 'swagger-ui-express';
import authRoutes from './modules/auth/auth.routes.js';
import staffRoutes from './modules/staff/staff.routes.js';
import departmentRoutes from './modules/department/department.routes.js';
import researchRoutes from './modules/research/research.routes.js';
import newsRoutes from './modules/news/news.routes.js';

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/api/auth', authRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/research', researchRoutes);
app.use('/api/news', newsRoutes);

app.get('/', (_, res) => {
  res.json({ message: 'COEEC Backend API - Running!' });
});

export default app;