import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User already exists with this email');
    }

    const passwordHash = await bcrypt.hash(createUserDto.password, 12);
    
    const user = this.usersRepository.create({
      ...createUserDto,
      password_hash: passwordHash,
    });

    return await this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    const users = await this.usersRepository.find({
      relations: ['managed_customers'],
    });
    
    return users.map(user => {
      const { password_hash, mfa_secret, ...sanitizedUser } = user;
      return sanitizedUser as User;
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['managed_customers', 'assigned_jobs'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const { password_hash, mfa_secret, ...sanitizedUser } = user;
    return sanitizedUser as User;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 12);
    }

    Object.assign(user, updateUserDto);
    return await this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }

  async getTechnicians(): Promise<User[]> {
    const technicians = await this.usersRepository.find({
      where: { role: UserRole.TECHNICIAN, is_active: true },
    });
    
    return technicians.map(tech => {
      const { password_hash, mfa_secret, ...sanitizedTech } = tech;
      return sanitizedTech as User;
    });
  }
}
