import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isNull, omitBy, range } from 'lodash';
import { checkVechicleAvailable } from 'src/booking/booking.service';
import { createError } from 'src/common/utils';
import { Repository } from 'typeorm';
import {
  CreateCarInput,
  CreateCarOutput,
  DeleteCarInput,
  DeleteCarOutput,
  GetCarDetailInput,
  GetCarDetailOutput,
  GetCarsByInput,
  GetCarsByOutput,
  UpdateCarInput,
  UpdateCarOutput,
} from './dto/car.dto';
import {
  CreateMotorBikeInput,
  CreateMotorBikeOutput,
  DeleteMotorBikeInput,
  DeleteMotorBikeOutput,
  GetMotorBikeDetailInput,
  GetMotorBikeDetailOutput,
  GetMotorBikesByInput,
  GetMotorBikesByOutput,
  UpdateMotorBikeInput,
  UpdateMotorBikeOutput,
} from './dto/motorbike.dto';
import { Car } from './entities/car.entity';
import { MotorBike } from './entities/motobike.entity';
import { VehicleStatus } from './entities/vehicle.entity';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(Car) private readonly carRepo: Repository<Car>,
    @InjectRepository(MotorBike)
    private readonly motorBikeRepo: Repository<MotorBike>,
  ) {}
  async createCar(input: CreateCarInput): Promise<CreateCarOutput> {
    try {
      const car = this.carRepo.create(input);
      car.vehicleStatuses = range(car.totalQuantity).map<VehicleStatus>((e) => {
        return {
          booked: false,
          goodCondition: true,
          vehicleNumber: e,
        };
      });
      await this.carRepo.save(car);
      return {
        ok: true,
      };
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

  async getCarsBy(input: GetCarsByInput): Promise<GetCarsByOutput> {
    try {
      const {
        startDate,
        endDate,
        pagination: { page, resultsPerPage },
      } = input;
      if ((startDate && !endDate) || (!startDate && endDate))
        return createError('Input', 'Invalid input');
      const whereObject = omitBy(input, isNull);
      delete whereObject['startDate'];
      delete whereObject['endDate'];
      delete whereObject['pagination'];
      const cars = await this.carRepo.find({
        where: {
          ...whereObject,
        },
        relations: ['bookings'],
      });
      const start = (page - 1) * resultsPerPage;
      const end = start + resultsPerPage;
      let availableCars = cars.filter((car) =>
        checkVechicleAvailable({ vehicle: car, startDate, endDate }),
      );
      const totalResults = availableCars.length;
      availableCars = availableCars.slice(start, end);
      return {
        ok: true,
        cars: availableCars,
        pagination: {
          totalResults,
          totalPages: Math.floor(totalResults / resultsPerPage) + 1,
        },
      };
    } catch (error) {
      return createError('Server', 'Server error, please try again later');
    }
  }

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

  async createMotorBike(
    input: CreateMotorBikeInput,
  ): Promise<CreateMotorBikeOutput> {
    try {
      await this.motorBikeRepo.save(this.motorBikeRepo.create(input));
      return {
        ok: true,
      };
    } catch {
      return createError('Server', 'Server error, please try again later');
    }
  }
  async getMotorBikeDetail({
    motorBikeId,
  }: GetMotorBikeDetailInput): Promise<GetMotorBikeDetailOutput> {
    try {
      return {
        ok: true,
        motorBike: await this.motorBikeRepo.findOneBy({ id: motorBikeId }),
      };
    } catch {
      return createError('Server', 'Server error, please try again later');
    }
  }

  async getMotorBikesBy(
    input: GetMotorBikesByInput,
  ): Promise<GetMotorBikesByOutput> {
    try {
      const {
        startDate,
        endDate,
        pagination: { page, resultsPerPage },
      } = input;
      if ((startDate && !endDate) || (!startDate && endDate))
        return createError('Input', 'Invalid input');
      const whereObject = omitBy(input, isNull);
      delete whereObject['startDate'];
      delete whereObject['endDate'];
      delete whereObject['pagination'];
      const motorBikes = await this.motorBikeRepo.find({
        where: {
          ...whereObject,
        },
        relations: ['bookings'],
      });
      const start = (page - 1) * resultsPerPage;
      const end = start + resultsPerPage;
      let availableMotorBikes = motorBikes.filter((motorBike) =>
        checkVechicleAvailable({ vehicle: motorBike, startDate, endDate }),
      );
      const totalResults = availableMotorBikes.length;
      availableMotorBikes = availableMotorBikes.slice(start, end);
      return {
        ok: true,
        motorBikes: availableMotorBikes,
        pagination: {
          totalResults,
          totalPages: Math.floor(totalResults / resultsPerPage) + 1,
        },
      };
    } catch (error) {
      return createError('Server', 'Server error, please try again later');
    }
  }

  async updateMotorBike(
    input: UpdateMotorBikeInput,
  ): Promise<UpdateMotorBikeOutput> {
    try {
      let motorBike = await this.motorBikeRepo.findBy({
        id: input.motorBikeId,
      });
      if (!motorBike)
        return createError('Motorbike id', 'Invalid motorBike id');
      motorBike = {
        ...motorBike,
        ...input,
      };
      await this.motorBikeRepo.save(motorBike);
      return {
        ok: true,
      };
    } catch (error) {
      return createError('Server', 'Server error, please try again later');
    }
  }

  async deleteMotorBike({
    motorBikeId,
  }: DeleteMotorBikeInput): Promise<DeleteMotorBikeOutput> {
    try {
      const car = await this.motorBikeRepo.findBy({ id: motorBikeId });
      if (!car) return createError('Car id', 'Invalid car id');
      await this.motorBikeRepo.remove(car);
      return { ok: true };
    } catch (error) {
      return createError('Server', 'Server error, please try again later');
    }
  }
}
