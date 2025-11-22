import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Site } from './site.entity';
import { Contract } from './contract.entity';
import { JobType } from './job-type.entity';
import { User } from './user.entity';
import { JobAsset } from './job-asset.entity';
import { JobForm } from './job-form.entity';
import { Defect } from './defect.entity';

@Entity('jobs')
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Site, site => site.jobs, { onDelete: 'CASCADE' })
  site: Site;

  @ManyToOne(() => Contract, { nullable: true })
  contract: Contract;

  @ManyToOne(() => JobType)
  job_type: JobType;

  @ManyToOne(() => User, { nullable: true })
  assigned_technician: User;

  @ManyToOne(() => Job, { nullable: true })
  parent_job: Job;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: 'scheduled' })
  status: string;

  @Column({ default: 'medium' })
  priority: string;

  @Column({ nullable: true })
  scheduled_date: Date;

  @Column({ nullable: true })
  scheduled_start_time: Date;

  @Column({ nullable: true })
  scheduled_end_time: Date;

  @Column({ nullable: true })
  actual_start_time: Date;

  @Column({ nullable: true })
  actual_end_time: Date;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
  estimated_hours: number;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
  actual_hours: number;

  @Column({ type: 'text', nullable: true })
  customer_notes: string;

  @Column({ type: 'text', nullable: true })
  internal_notes: string;

  @ManyToOne(() => User)
  created_by: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @OneToMany(() => JobAsset, jobAsset => jobAsset.job)
  job_assets: JobAsset[];

  @OneToMany(() => JobForm, jobForm => jobForm.job)
  job_forms: JobForm[];

  @OneToMany(() => Defect, defect => defect.job)
  defects: Defect[];
}
