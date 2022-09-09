import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from 'src/car/entities/car.entity';
import { CarType } from 'src/car/entities/carType.entity';
import { User } from 'src/user/entities/user.entity';
import { DataService } from './data.service';

@Module({
  providers: [DataService],
  imports: [TypeOrmModule.forFeature([Car, CarType, User])],
})
export class DataModule {}
