import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import { createError } from 'src/common/utils';
import { User, UserRole } from 'src/user/entities/user.entity';
import { Car } from 'src/vehicle/entities/car.entity';
import { MotorBike } from 'src/vehicle/entities/motobike.entity';
import { VehicleType } from 'src/vehicle/entities/vehicle.entity';
import {
  Between,
  DataSource,
  FindOptionsWhere,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import {
  CheckVehicleAvailableInput,
  CheckVehicleAvailableOutput,
  CreateBookingInput,
  CreateBookingOutput,
  GetBookingDetailInput,
  GetBookingDetailOutput,
  GetBookingsByInput,
  GetBookingsByOutput,
  UpdateBookingInput,
  UpdateBookingOutput,
} from './dto';
import { Booking, BookingStatus } from './entities/booking.entity';
export function checkVechicleAvailable(input: {
  vehicle: Car | MotorBike;
  startDate: Date;
  endDate: Date;
}): boolean {
  const { vehicle, startDate, endDate } = input;
  if (startDate < endDate) return false;
  if (!vehicle.bookings) return true;
  let count = 0;
  vehicle.bookings
    .filter((booking) => booking.status === BookingStatus.VEHICLE_TAKEN)
    .forEach((booking) => {
      const bookingStartDate = new Date(booking.startDate);
      const bookingEndDate = new Date(booking.endDate);
      const a = bookingStartDate <= startDate && bookingEndDate > startDate;
      const b = bookingStartDate < endDate && bookingEndDate >= endDate;
      if (a || b) count += 1;
    });
  if (count == vehicle.totalQuantity) return false;
  return true;
}
@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
    @InjectRepository(Car) private readonly carRepo: Repository<Car>,
    @InjectRepository(MotorBike)
    private readonly motorBikeRepo: Repository<MotorBike>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  async checkVehicleAvailable(
    input: CheckVehicleAvailableInput,
  ): Promise<CheckVehicleAvailableOutput> {
    try {
      // get vehicle
      const { vehicleId, startDate, endDate, vehicleType } = input;
      let vehicle: Car | MotorBike;
      const condition = {
        where: { id: vehicleId },
        relations: ['bookings'],
      };
      if (vehicleType === VehicleType.CAR)
        vehicle = await this.carRepo.findOne(condition);
      else if (vehicleType === VehicleType.MOTOR_BIKE)
        vehicle = await this.motorBikeRepo.findOne(condition);

      // check and return result
      if (!vehicle) return createError('Vehicle', 'Vehicle does not exist');
      if (!checkVechicleAvailable({ vehicle, startDate, endDate }))
        return {
          ok: true,
          available: false,
        };
      return {
        ok: true,
        available: true,
      };
    } catch (error) {
      return createError('Server', 'Server error, please try again later');
    }
  }

  async createBooking(
    currentUser: User,
    input: CreateBookingInput,
  ): Promise<CreateBookingOutput> {
    try {
      const {
        vehicleId,
        endDate,
        startDate,
        note,
        payment,
        homeDelivery,
        vehicleType,
      } = input;

      // get the booked vehicle
      let vehicle: Car | MotorBike;
      const findOneObject = {
        where: { id: vehicleId },
        relations: ['bookings'],
      };
      const repoObject = {
        [VehicleType.CAR]: this.carRepo,
        [VehicleType.MOTOR_BIKE]: this.motorBikeRepo,
      };
      vehicle = await repoObject[vehicleType].findOne(findOneObject);

      if (!vehicle) return createError('Vehicle', 'Vehicle does not exist');
      if (!checkVechicleAvailable({ vehicle, startDate, endDate }))
        return createError('Input', 'Can not book vehicle on those days');

      // create booking
      const bookingCode = (
        randomBytes(4).toString('hex') + Date.now().toString(18)
      ).toUpperCase();
      const booking = this.bookingRepo.create({
        bookingCode,
        endDate,
        startDate,
        note,
        payment,
        homeDelivery,
        status: BookingStatus.PENDING,
        totalPrice: vehicle.price,
        user: currentUser,
      });
      if (vehicleType === VehicleType.CAR) {
        booking.car = vehicle as Car;
        booking.vehicleType = VehicleType.CAR;
      } else if (vehicleType === VehicleType.MOTOR_BIKE) {
        booking.vehicleType = VehicleType.MOTOR_BIKE;
        booking.motorBike = vehicle as MotorBike;
      }

      // udpate vehicle status of booked vehicle
      const vehicleStatus = vehicle.vehicleStatuses.find(
        (vs) => !vs.booked && vs.goodCondition,
      );
      if (!vehicleStatus)
        return createError('Vehicle', 'Can not book vehicle on those days');
      booking.vehicleNumber = vehicleStatus.vehicleNumber;
      vehicleStatus.booked = true;
      await this.dataSource.transaction(async (etm) => {
        await etm.save(vehicle);
        await etm.save(booking);
      });
      return {
        ok: true,
        bookingCode,
      };
    } catch (error) {
      return createError('Server', 'Server error, please try again later');
    }
  }

  async updateBookingStatus({
    bookingId,
    status,
  }: UpdateBookingInput): Promise<UpdateBookingOutput> {
    try {
      const booking = await this.bookingRepo.findOneBy({ id: bookingId });
      if (!booking) return createError('Booking id', 'Invalid booking id');
      if (
        (booking.status === BookingStatus.PENDING &&
          status !== BookingStatus.VEHICLE_TAKEN) ||
        (booking.status === BookingStatus.VEHICLE_TAKEN &&
          status !== BookingStatus.FINISHED)
      )
        return createError('Booking status', 'Invalid booking status');
      booking.status = status;
      await this.bookingRepo.save(booking);
      return {
        ok: true,
      };
    } catch (error) {
      return createError('Server', 'Server error, please try again later');
    }
  }

  async getBookingDetail(
    currentUser: User,
    { bookingId }: GetBookingDetailInput,
  ): Promise<GetBookingDetailOutput> {
    try {
      const booking = await this.bookingRepo.findOne({
        where: { id: bookingId },
        relations: ['user'],
      });
      if (!booking)
        return createError('Booking id', 'Can not find booking with given id');
      if (
        currentUser.role !== UserRole.Admin &&
        booking.user.id !== currentUser.id
      )
        return createError(
          'Booking id',
          'You are not allowed to view this booking',
        );
      return {
        ok: true,
        booking,
      };
    } catch (error) {
      return createError('Server', 'Server error, please try again later');
    }
  }

  async getBookingsBy(
    currentUser: User,
    {
      vehicleType,
      endDate,
      startDate,
      pagination: { page, resultsPerPage },
    }: GetBookingsByInput,
  ): Promise<GetBookingsByOutput> {
    try {
      if (endDate && startDate && startDate > endDate)
        return createError('Input date', 'Invalid input dates');
      let bookings: Booking[] | null;
      let findCondition: FindOptionsWhere<Booking>;
      if (startDate && endDate) {
        findCondition = {
          vehicleType,
          createdAt: Between<Date>(startDate, endDate),
        };
      } else if (startDate) {
        findCondition = {
          vehicleType,
          createdAt: MoreThanOrEqual(startDate),
        };
      } else if (endDate) {
        findCondition = {
          vehicleType,
          createdAt: LessThanOrEqual(endDate),
        };
      }
      if (currentUser.role !== UserRole.Admin) {
        bookings = await this.bookingRepo.find({
          skip: (page - 1) * resultsPerPage,
          take: resultsPerPage,
          where: {
            user: {
              id: currentUser.id,
            },
            ...findCondition,
          },
        });
      } else {
        bookings = await this.bookingRepo.find({
          where: findCondition,
          skip: (page - 1) * resultsPerPage,
          take: resultsPerPage,
        });
      }
      const totalResults = bookings.length;
      return {
        ok: true,
        bookings,
        pagination: {
          totalPages: Math.floor(totalResults / resultsPerPage) + 1,
          totalResults: totalResults,
        },
      };
    } catch (error) {
      return createError('Server', 'Server error, please try again later');
    }
  }
}
