import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from 'src/email/email.module';
import { User } from 'src/user/entities/user.entity';
import { AuthGuard } from './auth.guard';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { Verification } from './entities/verification.entity';

@Module({
  providers: [
    AuthService,
    AuthResolver,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  imports: [
    TypeOrmModule.forFeature([User, Verification]),
    EmailModule,
    ConfigModule,
  ],
})
export class AuthModule {}
