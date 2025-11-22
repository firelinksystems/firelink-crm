import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Site } from './site.entity';
import { Contract } from './contract.entity';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  contact_email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ nullable: true })
  postcode: string;

  @Column({ default: 'UK' })
  country: string;

  @ManyToOne(() => User, { nullable: true })
  account_manager: User;

  @Column({ default: 'active' })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @OneToMany(() => Site, site => site.customer)
  sites: Site[];

  @OneToMany(() => Contract, contract => contract.customer)
  contracts: Contract[];
}
