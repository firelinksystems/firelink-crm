import express from 'express';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Get available engineers
router.get('/engineers', authenticate, async (req, res) => {
  try {
    const { date, skills } = req.query;

    // Mock engineers data
    const engineers = [
      {
        id: '1',
        name: 'Mike Engineer',
        email: 'mike@firelinksystem.com',
        phone: '+441234567891',
        skills: ['fire_alarms', 'cctv', 'access_control'],
        hourlyRate: 45.00,
        isActive: true,
        availability: {
          '2024-02-01': ['09:00-17:00'],
          '2024-02-02': ['09:00-13:00', '14:00-17:00']
        }
      },
      {
        id: '2',
        name: 'Sarah Technician',
        email: 'sarah@firelinksystem.com',
        phone: '+441234567892',
        skills: ['emergency_lighting', 'fire_extinguishers'],
        hourlyRate: 40.00,
        isActive: true,
        availability: {
          '2024-02-01': ['10:00-18:00']
        }
      }
    ];

    res.json({
      success: true,
      data: engineers
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch engineers' });
  }
});

// Assign engineer to job
router.post('/assign', authenticate, async (req, res) => {
  try {
    const { jobId, engineerId, assignedHours, role } = req.body;

    // Create assignment in database
    const assignment = {
      id: Date.now().toString(),
      jobId,
      engineerId,
      assignedHours,
      role,
      assignedAt: new Date().toISOString()
    };

    res.status(201).json({
      success: true,
      data: assignment
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to assign engineer' });
  }
});

// Get schedule calendar
router.get('/calendar', authenticate, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Mock calendar data
    const schedule = [
      {
        id: '1',
        jobId: '1',
        engineerId: '1',
        title: 'Fire Alarm Installation - ABC Security',
        start: '2024-02-01T09:00:00Z',
        end: '2024-02-01T17:00:00Z',
        engineer: 'Mike Engineer',
        customer: 'ABC Security Ltd',
        status: 'scheduled'
      }
    ];

    res.json({
      success: true,
      data: schedule
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch schedule' });
  }
});

export { router as schedulingRoutes };
