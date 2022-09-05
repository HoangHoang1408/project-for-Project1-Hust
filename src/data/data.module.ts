import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from 'src/car/entities/car.entity';
import { CarType } from 'src/car/entities/carType.entity';
import { DataService } from './data.service';

@Module({
  providers: [DataService],
  imports: [TypeOrmModule.forFeature([Car, CarType])],
})
export class DataModule {}
