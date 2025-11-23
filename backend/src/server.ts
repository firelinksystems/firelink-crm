import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'FireLink Backend'
  });
});

// Basic routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'FireLink System API',
    version: '1.0.0'
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`FireLink Server running on port ${PORT}`);
});
