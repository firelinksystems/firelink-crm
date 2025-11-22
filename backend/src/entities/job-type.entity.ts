import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Job } from './job.entity';

@Entity('job_types')
export class JobType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ default: 'medium' })
  priority: string;

  @Column({ nullable: true })
  sla_hours: number;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
  default_estimated_hours: number;

  @CreateDateColumn()
  created_at: Date;

  // Relations
  @OneToMany(() => Job, job => job.job_type)
  jobs: Job[];
}
