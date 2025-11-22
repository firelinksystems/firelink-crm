import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query,
  UseGuards,
  ParseUUIDPipe 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../entities/user.entity';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('FireLink - Customers')
@ApiBearerAuth()
@Controller('customers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'FireLink Systems - Create a new customer' })
  @ApiResponse({ status: 201, description: 'Customer created successfully' })
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @Get()
  @ApiOperation({ summary: 'FireLink Systems - Get all customers with pagination' })
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.customersService.findAll(
      paginationDto.page,
      paginationDto.limit,
    );
  }

  @Get('search')
  @ApiOperation({ summary: 'FireLink Systems - Search customers by name or email' })
  async search(
    @Query('q') search: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.customersService.findAll(
      paginationDto.page,
      paginationDto.limit,
      search,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'FireLink Systems - Get customer by ID' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.customersService.findOne(id);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'FireLink Systems - Get customer statistics' })
  async getStats(@Param('id', ParseUUIDPipe) id: string) {
    return this.customersService.getCustomerStats(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'FireLink Systems - Update customer' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customersService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'FireLink Systems - Delete customer' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.customersService.remove(id);
  }

  @Get(':id/sites')
  @ApiOperation({ summary: 'FireLink Systems - Get all sites for a customer' })
  async getCustomerSites(@Param('id', ParseUUIDPipe) id: string) {
    const customer = await this.customersService.findOne(id);
    return customer.sites;
  }
}
