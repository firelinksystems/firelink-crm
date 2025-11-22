import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Customer } from './customer.entity';
import { ContractType } from './contract-type.entity';
import { ContractSite } from './contract-site.entity';
import { Job } from './job.entity';

@Entity('contracts')
export class Contract {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Customer, customer => customer.contracts, { onDelete: 'CASCADE' })
  customer: Customer;

  @ManyToOne(() => ContractType)
  contract_type: ContractType;

  @Column({ type: 'date' })
  start_date: Date;

  @Column({ type: 'date', nullable: true })
  end_date: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  value: number;

  @Column({ default: 'active' })
  status: string;

  @Column({ default: true })
  auto_renew: boolean;

  @Column({ type: 'text', nullable: true })
  terms_and_conditions: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @OneToMany(() => ContractSite, contractSite => contractSite.contract)
  contract_sites: ContractSite[];

  @OneToMany(() => Job, job => job.contract)
  jobs: Job[];
}
