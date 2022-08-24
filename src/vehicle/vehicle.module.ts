import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from './entities/car.entity';
import { MotorBike } from './entities/motobike.entity';
import { VehicleResolver } from './vehicle.resolver';
import { VehicleService } from './vehicle.service';

@Module({
  imports: [TypeOrmModule.forFeature([Car, MotorBike])],
  providers: [VehicleService, VehicleResolver],
})
export class VehicleModule {}
