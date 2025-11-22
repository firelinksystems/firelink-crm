import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Contract } from './contract.entity';

@Entity('contract_types')
export class ContractType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  frequency_months: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn()
  created_at: Date;

  // Relations
  @OneToMany(() => Contract, contract => contract.contract_type)
  contracts: Contract[];
}
