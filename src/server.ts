// src/server.ts
import app from './app.js';
import { env } from './config/env.js';
import { prisma } from '../prisma.js';

async function startServer() {
  await prisma.$connect();
  console.log('Connected to PostgreSQL (Neon)');

  app.listen(env.PORT, () => {
    console.log(`Server running on http://localhost:${env.PORT}`);
    console.log(`Swagger: http://localhost:${env.PORT}/api-docs`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});