import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Car } from 'src/vehicle/entities/car.entity';
import { MotorBike } from 'src/vehicle/entities/motobike.entity';
import { BookingResolver } from './booking.resolver';
import { BookingService } from './booking.service';
import { Booking } from './entities/booking.entity';

@Module({
  providers: [BookingResolver, BookingService],
  imports: [TypeOrmModule.forFeature([Booking, Car, MotorBike, User])],
})
export class BookingModule {}
