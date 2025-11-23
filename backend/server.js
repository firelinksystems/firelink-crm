const express = require('express');
const path = require('path');

const app = express();

// Trust proxy for load balancers
app.set('trust proxy', true);

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(express.json());

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

// Root endpoint - serve the frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'FireLink System',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'production'
  });
});

// API info
app.get('/api', (req, res) => {
  res.json({ 
    message: '🔥 FireLink System API',
    version: '1.0.0',
    description: 'CRM for UK Fire & Security Companies',
    endpoints: [
      'GET  /',
      'GET  /health',
      'GET  /api',
      'GET  /api/customers',
      'GET  /api/customers/:id',
      'GET  /api/jobs',
      'GET  /api/jobs/:id',
      'GET  /api/engineers',
      'GET  /api/scheduling/calendar',
      'GET  /api/financial/invoices',
      'GET  /api/financial/profit-loss'
    ]
  });
});

// Mock data
const customers = [
  {
    id: '1',
    companyName: 'ABC Security Ltd',
    contactName: 'John Smith',
    email: 'john@abcsecurity.com',
    phone: '+441234567890',
    address: '123 Business Park, London',
    postcode: 'SW1A 1AA',
    vatNumber: 'GB123456789'
  },
  {
    id: '2',
    companyName: 'XYZ Manufacturing',
    contactName: 'Sarah Johnson',
    email: 'sarah@xyzmanufacturing.com',
    phone: '+441234567891',
    address: '456 Industrial Estate, Manchester',
    postcode: 'M1 1AB'
  }
];

const jobs = [
  {
    id: '1',
    customerId: '1',
    title: 'Fire Alarm Installation - Office Building',
    description: 'Install new fire alarm system throughout office building',
    jobType: 'INSTALLATION',
    status: 'SCHEDULED',
    priority: 'HIGH',
    scheduledStart: '2024-02-01T09:00:00Z',
    scheduledEnd: '2024-02-01T17:00:00Z',
    estimatedHours: 8
  },
  {
    id: '2',
    customerId: '2',
    title: 'Emergency Lighting Service',
    description: 'Routine service and testing of emergency lighting systems',
    jobType: 'SERVICE',
    status: 'COMPLETED',
    priority: 'MEDIUM',
    scheduledStart: '2024-01-15T10:00:00Z',
    scheduledEnd: '2024-01-15T14:00:00Z',
    estimatedHours: 4,
    actualHours: 3.5
  }
];

const engineers = [
  {
    id: '1',
    name: 'Mike Engineer',
    email: 'mike@firelinksystem.com',
    phone: '+441234567891',
    skills: ['fire_alarms', 'cctv', 'access_control'],
    hourlyRate: 45.00,
    isActive: true
  },
  {
    id: '2',
    name: 'Sarah Technician',
    email: 'sarah@firelinksystem.com',
    phone: '+441234567892',
    skills: ['emergency_lighting', 'fire_extinguishers'],
    hourlyRate: 40.00,
    isActive: true
  }
];

// Customers API
app.get('/api/customers', (req, res) => {
  res.json({
    success: true,
    data: customers,
    total: customers.length
  });
});

app.get('/api/customers/:id', (req, res) => {
  const customer = customers.find(c => c.id === req.params.id);
  if (!customer) {
    return res.status(404).json({
      success: false,
      error: 'Customer not found'
    });
  }
  
  res.json({
    success: true,
    data: customer
  });
});

// Jobs API
app.get('/api/jobs', (req, res) => {
  res.json({
    success: true,
    data: jobs,
    total: jobs.length
  });
});

app.get('/api/jobs/:id', (req, res) => {
  const job = jobs.find(j => j.id === req.params.id);
  if (!job) {
    return res.status(404).json({
      success: false,
      error: 'Job not found'
    });
  }
  
  res.json({
    success: true,
    data: job
  });
});

// Engineers API
app.get('/api/engineers', (req, res) => {
  res.json({
    success: true,
    data: engineers,
    total: engineers.length
  });
});

// Scheduling API
app.get('/api/scheduling/calendar', (req, res) => {
  const schedule = jobs.map(job => ({
    id: job.id,
    jobId: job.id,
    title: job.title,
    start: job.scheduledStart,
    end: job.scheduledEnd,
    engineer: 'Mike Engineer',
    customer: customers.find(c => c.id === job.customerId)?.companyName,
    status: job.status.toLowerCase()
  }));
  
  res.json({
    success: true,
    data: schedule
  });
});

// Financial API
app.get('/api/financial/invoices', (req, res) => {
  const invoices = [
    {
      id: '1',
      jobId: '1',
      invoiceNumber: 'INV-001',
      amount: 2500.00,
      vatAmount: 500.00,
      totalAmount: 3000.00,
      status: 'SENT',
      dueDate: '2024-02-15T00:00:00Z',
      sentDate: '2024-01-20T00:00:00Z'
    },
    {
      id: '2',
      jobId: '2',
      invoiceNumber: 'INV-002',
      amount: 600.00,
      vatAmount: 120.00,
      totalAmount: 720.00,
      status: 'PAID',
      dueDate: '2024-01-30T00:00:00Z',
      sentDate: '2024-01-16T00:00:00Z',
      paidDate: '2024-01-25T00:00:00Z'
    }
  ];
  
  res.json({
    success: true,
    data: invoices,
    total: invoices.length
  });
});

// Profit & Loss API
app.get('/api/financial/profit-loss', (req, res) => {
  const report = {
    period: {
      startDate: '2024-01-01',
      endDate: '2024-01-31'
    },
    revenue: 3720.00,
    costs: {
      labour: 800.00,
      materials: 450.00,
      travel: 120.00,
      subcontractor: 0.00,
      overhead: 500.00
    },
    totalCosts: 1870.00,
    grossProfit: 1850.00,
    netProfit: 1850.00,
    margin: 49.7
  };
  
  res.json({
    success: true,
    data: report
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.originalUrl,
    suggestion: 'Visit /api for available endpoints'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🔥 FireLink System running on port ${PORT}`);
  console.log(`🌐 Access: http://localhost:${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/health`);
  console.log(`🚀 API: http://localhost:${PORT}/api`);
});
