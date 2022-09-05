import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from 'src/car/entities/car.entity';
import { CarType } from 'src/car/entities/carType.entity';
import { BookingResolver } from './booking.resolver';
import { BookingService } from './booking.service';
import { Booking } from './entities/booking.entity';

@Module({
  providers: [BookingResolver, BookingService],
  imports: [TypeOrmModule.forFeature([Car, CarType, Booking])],
})
export class BookingModule {}
