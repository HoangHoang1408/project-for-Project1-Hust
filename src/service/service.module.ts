import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { ServiceResolver } from './service.resolver';
import { ServiceService } from './service.service';

@Module({
  providers: [ServiceResolver, ServiceService],
  imports: [TypeOrmModule.forFeature([Service])],
})
export class ServiceModule {}
