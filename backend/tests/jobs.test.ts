import request from 'supertest';
import { app } from '../src/server';

describe('Jobs API', () => {
  let authToken: string;

  beforeAll(async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@firelinksystem.com',
        password: 'password'
      });
    
    authToken = response.body.token;
  });

  it('should get jobs list', async () => {
    const response = await request(app)
      .get('/api/jobs')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
  });

  it('should create a new job', async () => {
    const jobData = {
      customerId: '1',
      title: 'Test Job',
      description: 'Test job description',
      jobType: 'SERVICE',
      priority: 'MEDIUM',
      scheduledStart: '2024-02-01T09:00:00Z',
      scheduledEnd: '2024-02-01T17:00:00Z',
      estimatedHours: 8
    };

    const response = await request(app)
      .post('/api/jobs')
      .set('Authorization', `Bearer ${authToken}`)
      .send(jobData)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.title).toBe(jobData.title);
  });
});
