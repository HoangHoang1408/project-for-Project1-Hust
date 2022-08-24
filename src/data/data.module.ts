import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from 'src/vehicle/entities/car.entity';
import { MotorBike } from 'src/vehicle/entities/motobike.entity';
import { DataService } from './data.service';

@Module({
  providers: [DataService],
  imports: [TypeOrmModule.forFeature([Car, MotorBike])],
})
export class DataModule {}
