export interface Engineer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  skills: string[];
  hourlyRate: number;
  isActive: boolean;
  createdAt: Date;
}

export interface EngineerAvailability {
  engineerId: string;
  date: string;
  availableSlots: string[];
}

export interface JobAssignment {
  id: string;
  jobId: string;
  engineerId: string;
  assignedHours?: number;
  actualHours?: number;
  role: string;
  assignedAt: Date;
}
