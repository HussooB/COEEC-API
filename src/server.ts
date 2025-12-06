// src/server.ts
import app from './app.js';
import { env } from './config/env.js';
import { prisma } from './prisma.js';

// Health check endpoint — Render will ping this to stay awake
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'COEEC Backend is alive!',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

async function startServer() {
  try {
    await prisma.$connect();
    console.log('Connected to PostgreSQL (Neon)');

    app.listen(env.PORT, () => {
      console.log(`Server running on http://localhost:${env.PORT}`);
      console.log(`Swagger Docs: http://localhost:${env.PORT}/api-docs`);
      console.log(`Health Check: http://localhost:${env.PORT}/health`);
      console.log(`Use this URL in UptimeRobot → http://your-app.onrender.com/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();