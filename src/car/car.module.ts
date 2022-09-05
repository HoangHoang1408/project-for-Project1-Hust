// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { Car } from './entities/car.entity';
// import { MotorBike } from './entities/motobike.entity';
// import { VehicleResolver } from './vehicle.resolver';
// import { VehicleService } from './vehicle.service';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarResolver } from './car.resolver';
import { CarService } from './car.service';
import { Car } from './entities/car.entity';
import { CarType } from './entities/carType.entity';

@Module({
  providers: [CarService, CarResolver],
  imports: [TypeOrmModule.forFeature([Car, CarType])],
})
export class CarModule {}
