import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { Job } from './job.entity';
import { Asset } from './asset.entity';

@Entity('job_assets')
export class JobAsset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Job, job => job.job_assets, { onDelete: 'CASCADE' })
  job: Job;

  @ManyToOne(() => Asset, asset => asset.job_assets, { onDelete: 'CASCADE' })
  asset: Asset;

  @CreateDateColumn()
  created_at: Date;
}
