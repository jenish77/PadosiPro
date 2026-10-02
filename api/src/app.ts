import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { env } from './config/env';
import routes from './routes';
import { errorHandler } from './middlewares/error.middleware';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Morgan HTTP Logger
app.use(morgan('dev'));

// Custom Detailed Request Logger
app.use((req, _res, next) => {
  if (req.path !== '/health') {
    console.log(`\n[API REQ] ➡️  ${req.method} ${req.originalUrl}`);
    if (req.body && Object.keys(req.body).length > 0) {
      const sanitizedBody = { ...req.body };
      if (sanitizedBody.password) sanitizedBody.password = '***';
      console.log(`[API BODY] 📦`, JSON.stringify(sanitizedBody));
    }
  }
  next();
});

// Health Check
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'PadosiPro API', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/v1', routes);

// Global Error Handler
app.use(errorHandler);

// Start Server if launched directly
if (require.main === module) {
  const PORT = parseInt(env.PORT, 10);
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 PadosiPro Backend API running on port ${PORT}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/health`);
    console.log(`=======================================================`);
  });
}

export default app;
