import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../entities/user.entity';
import { RefreshToken } from '../entities/refresh-token.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private refreshTokensRepository: Repository<RefreshToken>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersRepository.findOne({ 
      where: { email, is_active: true } 
    });
    
    if (user && await bcrypt.compare(password, user.password_hash)) {
      user.last_login = new Date();
      await this.usersRepository.save(user);
      return user;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user);
    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User already exists with this email');
    }

    const passwordHash = await bcrypt.hash(registerDto.password, 12);
    
    const user = this.usersRepository.create({
      ...registerDto,
      password_hash: passwordHash,
    });

    await this.usersRepository.save(user);
    
    const tokens = await this.generateTokens(user);
    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  private async generateTokens(user: User) {
    const payload = { 
      sub: user.id, 
      email: user.email, 
      role: user.role 
    };

    const accessToken = this.jwtService.sign(payload, { 
      expiresIn: '15m' 
    });
    
    const refreshToken = this.jwtService.sign(payload, { 
      expiresIn: '7d' 
    });

    // Save refresh token
    await this.refreshTokensRepository.save({
      user,
      token: refreshToken,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  private sanitizeUser(user: User) {
    const { password_hash, mfa_secret, ...sanitizedUser } = user;
    return sanitizedUser;
  }

  async getProfile(userId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.sanitizeUser(user);
  }
}
