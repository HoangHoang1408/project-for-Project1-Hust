import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import { sampleSize } from 'lodash';
import { Car } from 'src/car/entities/car.entity';
import { CarType } from 'src/car/entities/carType.entity';
import { createError } from 'src/common/utils';
import { User, UserRole } from 'src/user/entities/user.entity';
import { FindManyOptions, In, Repository } from 'typeorm';
import {
  CheckCarAvailableInput,
  CheckCarAvailableOutput,
  CreateBookingInput,
  CreateBookingOutput,
  GetBookingDetailInput,
  GetBookingDetailOutput,
  GetBookingsByInput,
  GetBookingsByOutput,
  UpdateBookingInput,
  UpdateBookingOutput,
} from './dto';
import { BookingFeedBackInput, BookingFeedBackOutput } from './dto/booking.dto';
import { Booking, BookingStatus } from './entities/booking.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
    @InjectRepository(Car) private readonly carRepo: Repository<Car>,
    @InjectRepository(CarType)
    private readonly carTypeRepo: Repository<CarType>,
  ) {}
  private async checkCar(input: CheckCarAvailableInput) {
    const { carType: carTypeName, endDate, quantity, startDate } = input;
    try {
      const carType = await this.carTypeRepo.findOne({
        where: {
          carType: carTypeName,
        },
        relations: {
          bookings: {
            cars: true,
          },
          cars: true,
        },
      });
      if (!carType) return false;
      const bookings = carType.bookings;
      const cars = carType.cars;
      const totalCar = cars.length;
      const bookedIds = new Set<number>();
      for (const booking of bookings) {
        if (
          new Date(booking.startDate) > endDate ||
          new Date(booking.endDate) < startDate
        )
          continue;
        booking.cars.forEach((c) => bookedIds.add(c.id));
        if (bookedIds.size + +quantity > totalCar) false;
      }
      return true;
    } catch (error) {
      return false;
    }
  }
  async checkCarAvailable(
    input: CheckCarAvailableInput,
  ): Promise<CheckCarAvailableOutput> {
    const { endDate, startDate } = input;
    try {
      if (startDate >= endDate)
        return createError(
          'Date input',
          'Thời gian bắt đầu và kết thúc không hợp lệ',
        );
      if (!this.checkCar(input)) {
        return {
          ok: true,
          available: false,
        };
      }
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
    const {
      carTypeName,
      endDate,
      homeDelivery,
      note,
      payment,
      quantity,
      startDate,
      customerName,
      customerPhone,
    } = input;
    try {
      if (startDate >= endDate)
        return createError(
          'Date input',
          'Thời gian bắt đầu và kết thúc không hợp lệ',
        );
      const carType = await this.carTypeRepo.findOne({
        where: {
          carType: carTypeName,
        },
        relations: {
          cars: true,
        },
      });

      if (!carType)
        return createError('CarType', 'Loại xe yêu cầu không tồn tại');
      let bookings = await this.bookingRepo.find({
        where: {
          carType: {
            carType: carTypeName,
          },
          status: In([BookingStatus.DEPOSITED, BookingStatus.VEHICLE_TAKEN]),
        },
        relations: {
          cars: true,
        },
      });
      if (!bookings) bookings = [];
      const cars = carType.cars;
      const totalCar = cars.length;
      const bookedIds = new Set<number>();
      for (const booking of bookings) {
        if (
          new Date(booking.startDate) > endDate ||
          new Date(booking.endDate) < startDate
        )
          continue;
        booking.cars.forEach((c) => bookedIds.add(c.id));
        if (bookedIds.size + quantity > totalCar)
          return createError('Số lượng xe', 'Hiện không còn đủ xe để đặt');
      }
      const availableCars = cars.filter((c) => !bookedIds.has(c.id));
      const bookingCode = (
        randomBytes(4).toString('hex') + Date.now().toString(18)
      ).toUpperCase();
      await this.bookingRepo.save(
        this.bookingRepo.create({
          cars: sampleSize(availableCars, quantity),
          user: currentUser,
          bookingCode,
          carType,
          startDate,
          endDate,
          homeDelivery,
          note,
          payment,
          status: BookingStatus.NOT_DEPOSITE,
          totalPrice: carType.price * quantity,
          quantity,
          customerName,
          customerPhone,
        }),
      );
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
        (booking.status === BookingStatus.NOT_DEPOSITE &&
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
      if (!booking) return createError('Booking id', 'Đơn thuê không tồn tại');
      if (
        currentUser.role !== UserRole.Admin &&
        booking.user.id !== currentUser.id
      )
        return createError('Booking id', 'Bạn không có quyền xem đơn này');
      return {
        ok: true,
        booking,
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau!');
    }
  }

  async getBookingsBy(
    currentUser: User,
    {
      carType,
      endDate,
      startDate,
      pagination: { page, resultsPerPage },
    }: GetBookingsByInput,
  ): Promise<GetBookingsByOutput> {
    try {
      let bookings: Booking[], totalResults: number;
      let findOption: FindManyOptions<Booking>;
      if (currentUser.role === UserRole.Normal) {
        findOption = {
          where: {
            user: {
              id: currentUser.id,
            },
          },
        };
      }
      if (carType) {
        findOption.where['carType'] = {
          carType,
        };
      }
      bookings = await this.bookingRepo.find(findOption);
      if (startDate && endDate) {
        if (startDate >= endDate)
          return createError('Date', 'Ngày bắt đầu, kết thúc không hợp lệ');
        bookings = bookings.filter((b) => {
          const s = new Date(b.startDate);
          const e = new Date(b.endDate);
          return !(s > new Date(endDate) || e < new Date(startDate));
        });
      }
      totalResults = bookings.length;
      return {
        ok: true,
        bookings: bookings.slice(
          (page - 1) * resultsPerPage,
          page * resultsPerPage,
        ),
        pagination: {
          totalResults,
          totalPages: Math.floor(totalResults / resultsPerPage) + 1,
        },
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }

  async bookingFeedBack(
    currentUser: User,
    { feedback, rating, id }: BookingFeedBackInput,
  ): Promise<BookingFeedBackOutput> {
    try {
      const booking = await this.bookingRepo.findOne({
        where: {
          id,
        },
      });
      if (!booking) return createError('Input', 'Không tồn tại đơn thuê');
      if (currentUser.id !== booking.userId)
        return createError('User', 'Bạn không có quyền phản hồi đơn này');
      if (booking.rating)
        return createError('User', 'Đơn thuê đã được phản hồi trước đó');
      await this.bookingRepo.save({
        ...booking,
        feedBack: feedback,
        rating,
      });
      return {
        ok: true,
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
}
