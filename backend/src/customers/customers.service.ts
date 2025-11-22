import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Customer } from '../entities/customer.entity';
import { Site } from '../entities/site.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
    @InjectRepository(Site)
    private sitesRepository: Repository<Site>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const customer = this.customersRepository.create(createCustomerDto);
    return await this.customersRepository.save(customer);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
  ): Promise<{ data: Customer[]; total: number }> {
    const skip = (page - 1) * limit;
    let where = {};

    if (search) {
      where = [
        { name: Like(`%${search}%`) },
        { contact_email: Like(`%${search}%`) },
      ];
    }

    const [data, total] = await this.customersRepository.findAndCount({
      where,
      relations: ['sites', 'account_manager'],
      skip,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return { data, total };
  }

  async findOne(id: string): Promise<Customer> {
    const customer = await this.customersRepository.findOne({
      where: { id },
      relations: [
        'sites', 
        'sites.assets',
        'contracts',
        'contracts.contract_type',
        'account_manager'
      ],
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    return customer;
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    const customer = await this.findOne(id);
    Object.assign(customer, updateCustomerDto);
    return await this.customersRepository.save(customer);
  }

  async remove(id: string): Promise<void> {
    const customer = await this.findOne(id);
    await this.customersRepository.remove(customer);
  }

  async getCustomerStats(customerId: string) {
    const customer = await this.findOne(customerId);
    
    const siteCount = await this.sitesRepository.count({
      where: { customer: { id: customerId } },
    });

    const activeContracts = customer.contracts.filter(
      contract => contract.status === 'active',
    ).length;

    return {
      site_count: siteCount,
      active_contracts: activeContracts,
      total_contracts: customer.contracts.length,
    };
  }
}
