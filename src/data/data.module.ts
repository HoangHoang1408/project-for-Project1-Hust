import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from 'src/booking/entities/booking.entity';
import { Car } from 'src/car/entities/car.entity';
import { CarType } from 'src/car/entities/carType.entity';
import { Service } from 'src/service/entities/service.entity';
import { User } from 'src/user/entities/user.entity';
import { DataService } from './data.service';

@Module({
  providers: [DataService],
  imports: [TypeOrmModule.forFeature([Car, CarType, User, Service, Booking])],
})
export class DataModule {}
