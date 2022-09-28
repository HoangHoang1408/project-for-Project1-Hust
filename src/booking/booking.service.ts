import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import { range, sampleSize } from 'lodash';
import { Car } from 'src/car/entities/car.entity';
import { CarType } from 'src/car/entities/carType.entity';
import { createError } from 'src/common/utils';
import { Service } from 'src/service/entities/service.entity';
import { User, UserRole } from 'src/user/entities/user.entity';
import { FindManyOptions, ILike, In, Repository } from 'typeorm';
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
import {
  DayData,
  ForecastTableInput,
  ForecastTableOutput,
  TableRowData,
} from './dto/forecastTable.dto';
import { Booking, BookingStatus } from './entities/booking.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
    @InjectRepository(Car) private readonly carRepo: Repository<Car>,
    @InjectRepository(CarType)
    private readonly carTypeRepo: Repository<CarType>,
    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,
  ) {}
  private async checkCar(input: CheckCarAvailableInput) {
    const { carType: carTypeName, endDate, quantity, startDate } = input;
    try {
      const carType = await this.carTypeRepo.findOne({
        where: {
          carType: carTypeName,
        },
        relations: {
          cars: true,
        },
      });
      if (!carType) return false;
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
      const cars = carType.cars;
      const totalCar = cars.length;
      if (+quantity > totalCar) return false;
      const bookedIds = new Set<number>();
      for (const booking of bookings) {
        if (
          new Date(booking.startDate) > endDate ||
          new Date(booking.endDate) < startDate
        )
          continue;
        booking.cars.forEach((c) => bookedIds.add(c.id));
        if (bookedIds.size + +quantity > totalCar) return false;
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
      if (
        startDate.getDate() < new Date().getDate() ||
        endDate.getDate() < new Date().getDate()
      )
        return createError(
          'Date input',
          'Không được đặt xe trước thời điểm hiện tại',
        );
      if (!(await this.checkCar(input))) {
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
      serviceIds,
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
      if (+quantity > totalCar)
        return createError('Số lượng xe', 'Hiện không còn đủ xe để đặt');
      const bookedIds = new Set<number>();
      for (const booking of bookings) {
        if (
          new Date(booking.startDate) > endDate ||
          new Date(booking.endDate) < startDate
        )
          continue;
        booking.cars.forEach((c) => bookedIds.add(c.id));
        if (bookedIds.size + +quantity > totalCar)
          return createError('Số lượng xe', 'Hiện không còn đủ xe để đặt');
      }
      const availableCars = cars.filter((c) => !bookedIds.has(c.id));
      let services: Service[] = [];
      if (serviceIds && serviceIds.length > 0)
        try {
          services = await Promise.all(
            serviceIds.map((id) => this.serviceRepo.findOneBy({ id: +id })),
          );
        } catch (error) {
          return createError('services', 'Dịch vụ không hợp lệ');
        }
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
          totalPrice: this.calcTotalPrice(
            startDate,
            endDate,
            carType.price,
            quantity,
            services.map(({ servicePrice, perDay }) => ({
              perDay,
              price: servicePrice,
            })),
          ),
          quantity,
          customerName,
          customerPhone,
          services,
        }),
      );
      return {
        ok: true,
        bookingCode,
      };
    } catch (error) {
      console.log(error);
      return createError('Server', 'Server error, please try again later');
    }
  }

  async updateBookingStatus(
    currentUser: User,
    { bookingId, status }: UpdateBookingInput,
  ): Promise<UpdateBookingOutput> {
    try {
      const booking = await this.bookingRepo.findOne({
        where: { id: bookingId },
        relations: {
          carType: true,
        },
      });
      if (!booking) return createError('Booking id', 'Đơn thuê không hợp lệ');
      if (
        currentUser.role === UserRole.Admin &&
        status === BookingStatus.DEPOSITED &&
        booking.status === BookingStatus.NOT_DEPOSITE
      ) {
        const valid = await this.checkCar({
          carType: booking.carType.carType,
          endDate: booking.endDate,
          startDate: booking.startDate,
          quantity: booking.quantity,
        });
        if (!valid)
          return createError(
            '',
            'Các xe đã được đặt trước, không thể tiền hành đơn thuê này',
          );
      }
      let canSet = true;
      if (currentUser.role === UserRole.Normal) {
        if (booking.userId !== currentUser.id)
          return createError('user', 'Người dùng không hợp lệ');
        if (status === BookingStatus.CANCEL) {
          if (
            ![BookingStatus.NOT_DEPOSITE, BookingStatus.DEPOSITED].includes(
              booking.status,
            )
          )
            canSet = false;
        }
      } else if (currentUser.role === UserRole.Admin) {
        if (
          (booking.status === BookingStatus.NOT_DEPOSITE &&
            !(status === BookingStatus.DEPOSITED)) ||
          (booking.status === BookingStatus.DEPOSITED &&
            !(status === BookingStatus.VEHICLE_TAKEN)) ||
          (booking.status === BookingStatus.VEHICLE_TAKEN &&
            !(status === BookingStatus.FINISHED))
        ) {
          canSet = false;
        }
      }
      if (canSet) booking.status = status;
      else return createError('status', 'Trạng thái mới không hợp lệ');
      await this.bookingRepo.save(booking);
      return {
        ok: true,
      };
    } catch (error) {
      return createError('Server', 'Lỗi xảy ra, thử lại sau');
    }
  }

  async getBookingDetail(
    currentUser: User,
    { bookingId }: GetBookingDetailInput,
  ): Promise<GetBookingDetailOutput> {
    try {
      const booking = await this.bookingRepo.findOne({
        where: { id: bookingId },
        relations: {
          user: true,
          services: true,
        },
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
      bookingCode,
      bookingStatus,
      pagination: { page, resultsPerPage },
    }: GetBookingsByInput,
  ): Promise<GetBookingsByOutput> {
    try {
      let bookings: Booking[], totalResults: number;
      let findOption: FindManyOptions<Booking> = {
        where: {
          carType: {
            carType: carType || undefined,
          },
          bookingCode: bookingCode ? ILike(`%${bookingCode}%`) : undefined,
          status: bookingStatus || undefined,
        },
        order: {
          createdAt: 'DESC',
        },
      };
      if (currentUser.role === UserRole.Normal) {
        findOption.where['user'] = {
          id: currentUser.id,
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

  async forecastTable({
    carType,
    endDate,
    startDate,
  }: ForecastTableInput): Promise<ForecastTableOutput> {
    try {
      let bookings = await this.bookingRepo.find({
        where: {
          carType: {
            carType,
          },
          status: In([BookingStatus.DEPOSITED, BookingStatus.VEHICLE_TAKEN]),
        },
        relations: {
          cars: true,
        },
      });
      bookings = bookings.filter(
        (b) =>
          !(new Date(b.startDate) > endDate) || new Date(b.endDate) < startDate,
      );
      const cars = await this.carRepo.find({
        where: {
          carType: {
            carType,
          },
        },
        relations: {
          carType: true,
        },
      });
      const tableData = cars.map<TableRowData>((car) => ({
        car,
        dayDatas: this.getDatesInRange(startDate, endDate).map<DayData>(
          (date) => ({
            day: date,
          }),
        ),
        rowSumary: '',
      }));
      bookings.forEach((booking) => {
        booking.cars.forEach((c) => {
          const rowData = tableData.find((d) => d.car.id === c.id);
          rowData.dayDatas
            .filter(
              (dd) => dd.day >= booking.startDate && dd.day <= booking.endDate,
            )
            .forEach((dd) => (dd.status = booking.status));
        });
      });
      const columnData = range(tableData[0].dayDatas.length).map((_) => 0);
      tableData.forEach((r) => {
        let count = 0;
        r.dayDatas.forEach((d, i) => {
          if (d.status) {
            count += 1;
            columnData[i] += 1;
          }
        });
        r.rowSumary = `${count}/${r.dayDatas.length}`;
      });
      return {
        ok: true,
        tableData,
        columnSummary: columnData.map((d) => `${d}/${cars.length}`),
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
  getDatesInRange(startDate: Date, endDate: Date) {
    const date = new Date(startDate.getTime());
    date.setDate(date.getDate());
    const dates: Date[] = [];
    while (date <= endDate) {
      dates.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return dates;
  }
  countRentingDay = (startDate: Date, endDate: Date) => {
    const start = startDate.getTime();
    const end = endDate.getTime();
    return Math.round(((end - start) * 2) / 86400000) / 2;
  };
  calcServicePrice = (
    numOfDays: number,
    services: { price: number; perDay: boolean }[],
  ) => {
    return services.reduce(
      (pre, c) => pre + c.price * (c.perDay ? numOfDays : 1),
      0,
    );
  };
  calcTotalPrice(
    startDate: Date,
    endDate: Date,
    carPrice: number,
    quantity: number,
    services: { price: number; perDay: boolean }[],
  ) {
    const rentingDay = this.countRentingDay(startDate, endDate);
    return (
      (this.calcServicePrice(rentingDay, services) + carPrice * rentingDay) *
      quantity
    );
  }
}
