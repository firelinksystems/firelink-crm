import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/config';
import { errorHandler } from './middleware/errorHandler';
import { authRoutes } from './routes/auth';
import { customerRoutes } from './routes/customers';
import { jobRoutes } from './routes/jobs';
import { schedulingRoutes } from './routes/scheduling';
import { financialRoutes } from './routes/financial';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/scheduling', schedulingRoutes);
app.use('/api/financial', financialRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

const PORT = config.port || 3001;

app.listen(PORT, () => {
  console.log(`FireLink Server running on port ${PORT}`);
  console.log(`Environment: ${config.nodeEnv}`);
});
