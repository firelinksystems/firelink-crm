import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CustomersModule } from './customers/customers.module';
import { JobsModule } from './jobs/jobs.module';
import { SchedulingModule } from './scheduling/scheduling.module';
import { FormsModule } from './forms/forms.module';
import { AssetsModule } from './assets/assets.module';
import { ContractsModule } from './contracts/contracts.module';
import { DefectsModule } from './defects/defects.module';
import { WebSocketModule } from './websocket/websocket.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'firelink_user',
      password: process.env.DB_PASSWORD || 'firelink_password',
      database: process.env.DB_NAME || 'firelink_development',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV !== 'production',
    }),
    AuthModule,
    UsersModule,
    CustomersModule,
    JobsModule,
    SchedulingModule,
    FormsModule,
    AssetsModule,
    ContractsModule,
    DefectsModule,
    WebSocketModule,
  ],
})
export class AppModule {}
