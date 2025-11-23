import { Request, Response } from 'express';
import { JobService } from '../services/jobService';

export class JobController {
  private jobService: JobService;

  constructor() {
    this.jobService = new JobService();
  }

  getAllJobs = async (req: Request, res: Response) => {
    try {
      const { 
        page = 1, 
        limit = 10, 
        status, 
        customerId,
        dateFrom,
        dateTo 
      } = req.query;
      
      const result = await this.jobService.getAllJobs({
        page: Number(page),
        limit: Number(limit),
        status: status as string,
        customerId: customerId as string,
        dateFrom: dateFrom as string,
        dateTo: dateTo as string
      });
      
      res.json({
        success: true,
        data: result.jobs,
        pagination: result.pagination
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch jobs' });
    }
  };

  getJobById = async (req: Request, res: Response) => {
    try {
      const job = await this.jobService.getJobById(req.params.id);
      
      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }
      
      res.json({
        success: true,
        data: job
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch job' });
    }
  };

  createJob = async (req: Request, res: Response) => {
    try {
      const jobData = req.body;
      const newJob = await this.jobService.createJob(jobData);
      
      res.status(201).json({
        success: true,
        data: newJob
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create job' });
    }
  };

  updateJobStatus = async (req: Request, res: Response) => {
    try {
      const { status } = req.body;
      const updatedJob = await this.jobService.updateJobStatus(
        req.params.id,
        status
      );
      
      res.json({
        success: true,
        data: updatedJob
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update job status' });
    }
  };

  getJobProfitability = async (req: Request, res: Response) => {
    try {
      const profitability = await this.jobService.calculateJobProfitability(
        req.params.id
      );
      
      res.json({
        success: true,
        data: profitability
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to calculate profitability' });
    }
  };
}
