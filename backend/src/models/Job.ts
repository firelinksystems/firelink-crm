export type JobType = 'INSTALLATION' | 'SERVICE' | 'MAINTENANCE' | 'EMERGENCY' | 'QUOTE';
export type JobStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'INVOICED';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY';

export interface Job {
  id: string;
  customerId: string;
  title: string;
  description?: string;
  jobType: JobType;
  status: JobStatus;
  priority: Priority;
  scheduledStart?: Date;
  scheduledEnd?: Date;
  actualStart?: Date;
  actualEnd?: Date;
  estimatedHours?: number;
  actualHours?: number;
  createdAt: Date;
  updatedAt: Date;
  customer?: {
    companyName: string;
    contactName: string;
    email: string;
    phone?: string;
  };
}

export interface CreateJobData {
  customerId: string;
  title: string;
  description?: string;
  jobType: JobType;
  priority?: Priority;
  scheduledStart?: Date;
  scheduledEnd?: Date;
  estimatedHours?: number;
}

export interface JobFilters {
  status?: string;
  customerId?: string;
  dateFrom?: string;
  dateTo?: string;
  page: number;
  limit: number;
}

export interface JobProfitability {
  jobId: string;
  revenue: number;
  costs: {
    labour: number;
    materials: number;
    travel: number;
    subcontractor: number;
    other: number;
  };
  totalCosts: number;
  profit: number;
  margin: number;
}
