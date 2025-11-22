import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Job } from './job.entity';
import { FormTemplate } from './form-template.entity';
import { User } from './user.entity';

@Entity('job_forms')
export class JobForm {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Job, job => job.job_forms, { onDelete: 'CASCADE' })
  job: Job;

  @ManyToOne(() => FormTemplate)
  form_template: FormTemplate;

  @Column({ type: 'jsonb' })
  form_data: any;

  @ManyToOne(() => User)
  submitted_by: User;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  submitted_at: Date;

  @CreateDateColumn()
  created_at: Date;
}
