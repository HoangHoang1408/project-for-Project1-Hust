import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createError } from 'src/common/utils';
import { Repository } from 'typeorm';
import {
  CreateCarInput,
  CreateCarOutput,
  DeleteCarInput,
  DeleteCarOutput,
  GetCarDetailInput,
  GetCarDetailOutput,
  GetCarTypeInput,
  GetCarTypeOutput,
  UpdateCarInput,
  UpdateCarOutput,
} from './dto/car.dto';
import { Car } from './entities/car.entity';
import { CarType } from './entities/carType.entity';

@Injectable()
export class CarService {
  constructor(
    @InjectRepository(Car) private readonly carRepo: Repository<Car>,
    @InjectRepository(CarType)
    private readonly carTypeRepo: Repository<CarType>,
  ) {}
  async createCar(input: CreateCarInput): Promise<CreateCarOutput> {
    try {
      const car = this.carRepo.create(input);
      car.vehicleStatus = {
        booked: false,
        goodCondition: true,
      };
      await this.carRepo.save(car);
    } catch (err) {
      return createError('Server', 'Server error, please try again later');
    }
  }

  async getCarDetail({
    carId,
  }: GetCarDetailInput): Promise<GetCarDetailOutput> {
    try {
      return {
        ok: true,
        car: await this.carRepo.findOneBy({ id: carId }),
      };
    } catch {
      return createError('Server', 'Server error, please try again later');
    }
  }

  // async getCarsBy(input: GetCarsByInput): Promise<GetCarsByOutput> {
  //   try {
  //     const {
  //       startDate,
  //       endDate,
  //       pagination: { page, resultsPerPage },
  //     } = input;
  //     if ((startDate && !endDate) || (!startDate && endDate))
  //       return createError('Input', 'Invalid input');
  //     const whereObject = omitBy(input, isNull);
  //     delete whereObject['startDate'];
  //     delete whereObject['endDate'];
  //     delete whereObject['pagination'];
  //     const cars = await this.carRepo.find({
  //       where: {
  //         ...whereObject,
  //       },
  //       relations: ['bookings'],
  //     });
  //     const start = (page - 1) * resultsPerPage;
  //     const end = start + resultsPerPage;
  //     let availableCars = cars.filter((car) =>
  //       checkVechicleAvailable({ vehicle: car, startDate, endDate }),
  //     );
  //     const totalResults = availableCars.length;
  //     availableCars = availableCars.slice(start, end);
  //     return {
  //       ok: true,
  //       cars: availableCars,
  //       pagination: {
  //         totalResults,
  //         totalPages: Math.floor(totalResults / resultsPerPage) + 1,
  //       },
  //     };
  //   } catch (error) {
  //     return createError('Server', 'Server error, please try again later');
  //   }
  // }

  async updateCar(input: UpdateCarInput): Promise<UpdateCarOutput> {
    try {
      let car = await this.carRepo.findBy({ id: input.carId });
      if (!car) return createError('Car id', 'Invalid car id');
      car = {
        ...car,
        ...input,
      };
      await this.carRepo.save(car);
      return {
        ok: true,
      };
    } catch (error) {
      return createError('Server', 'Server error, please try again later');
    }
  }

  async deleteCar({ carId }: DeleteCarInput): Promise<DeleteCarOutput> {
    try {
      const car = await this.carRepo.findBy({ id: carId });
      if (!car) return createError('Car id', 'Invalid car id');
      await this.carRepo.remove(car);
      return { ok: true };
    } catch (error) {
      return createError('Server', 'Server error, please try again later');
    }
  }

  async getCarType({
    carType: carTypeName,
  }: GetCarTypeInput): Promise<GetCarTypeOutput> {
    try {
      const carType = await this.carTypeRepo.findOneBy({
        carType: carTypeName,
      });
      if (!carType) return createError('Loại xe', 'Không tồn tại loại xe');
      return {
        ok: true,
        carType,
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
}
