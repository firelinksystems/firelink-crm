import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Job } from './job.entity';
import { Asset } from './asset.entity';
import { User } from './user.entity';
import { DefectPhoto } from './defect-photo.entity';

@Entity('defects')
export class Defect {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Job, job => job.defects, { onDelete: 'CASCADE' })
  job: Job;

  @ManyToOne(() => Asset, { nullable: true })
  asset: Asset;

  @ManyToOne(() => User)
  reported_by: User;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: 'medium' })
  severity: string;

  @Column({ default: 'open' })
  status: string;

  @Column({ type: 'text', nullable: true })
  recommended_action: string;

  @Column({ default: false })
  safety_implications: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @OneToMany(() => DefectPhoto, defectPhoto => defectPhoto.defect)
  photos: DefectPhoto[];
}
