import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createError } from 'src/common/utils';
import { ILike, Repository } from 'typeorm';
import {
  CreateCarInput,
  CreateCarOutput,
  DeleteCarInput,
  DeleteCarOutput,
  GetCarDetailInput,
  GetCarDetailOutput,
  GetCarsByInput,
  GetCarsByOutput,
  GetCarTypeInput,
  GetCarTypeOutput,
  GetCarTypesInput,
  GetCarTypesOutput,
  UpdateCarInput,
  UpdateCarOutput,
  UpdateCarTypeInput,
  UpdateCarTypeOutput,
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
      const {
        carBrand,
        carType,
        consumption,
        engineType,
        features,
        images,
        licensePlate,
        manufactureYear,
        name,
        transmissionType,
      } = input;
      const tempCar = await this.carRepo.findOne({
        where: {
          engineType,
          manufactureYear,
          name,
          licensePlate,
        },
      });
      if (tempCar) {
        return createError('Input', 'Xe đã tồn tại');
      }
      const ct = await this.carTypeRepo.findOne({
        where: {
          carType,
        },
      });
      if (!ct) return createError('Loại xe', 'Loại xe không tồn tại');
      const car = this.carRepo.create({
        carBrand,
        consumption,
        engineType,
        features,
        images,
        licensePlate,
        manufactureYear,
        name,
        transmissionType,
        carType: ct,
      });
      car.vehicleStatus = {
        booked: false,
        goodCondition: true,
      };
      await this.carRepo.save(car);
      return {
        ok: true,
      };
    } catch (err) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }

  async getCarDetail({
    carId,
  }: GetCarDetailInput): Promise<GetCarDetailOutput> {
    try {
      const car = await this.carRepo.findOne({
        where: {
          id: carId,
        },
        relations: {
          carType: true,
        },
      });
      return {
        ok: true,
        car,
      };
    } catch {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }

  async getCarsBy({
    carType,
    carBrand,
    licensePlate,
    name,
    pagination: { page, resultsPerPage },
  }: GetCarsByInput): Promise<GetCarsByOutput> {
    try {
      const [cars, totalResults] = await this.carRepo.findAndCount({
        where: {
          carType: {
            carType: carType || undefined,
          },
          carBrand: carBrand || undefined,
          licensePlate: licensePlate ? ILike(`%${licensePlate}%`) : undefined,
          name: name ? ILike(`%${name}%`) : undefined,
        },
        skip: (page - 1) * resultsPerPage,
        take: resultsPerPage,
        relations: {
          carType: true,
        },
      });
      return {
        ok: true,
        cars,
        pagination: {
          totalPages: Math.ceil(totalResults / resultsPerPage),
          totalResults,
        },
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }

  async updateCar(input: UpdateCarInput): Promise<UpdateCarOutput> {
    try {
      let car = await this.carRepo.findOneBy({ id: input.carId });
      if (!car) return createError('Car id', 'Invalid car id');
      let carType: CarType | undefined = undefined;
      if (input.carType) {
        carType = await this.carTypeRepo.findOneBy({
          carType: input.carType,
        });
      }
      delete input.carType;
      car = {
        ...car,
        // @ts-ignore
        carType,
        ...input,
      };
      await this.carRepo.save(car);
      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }

  async deleteCar({ carId }: DeleteCarInput): Promise<DeleteCarOutput> {
    try {
      const car = await this.carRepo.findBy({ id: carId });
      if (!car) return createError('Car id', 'Invalid car id');
      await this.carRepo.remove(car);
      return { ok: true };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }

  async getCarType({
    carType: carTypeName,
  }: GetCarTypeInput): Promise<GetCarTypeOutput> {
    try {
      const carType = await this.carTypeRepo.findOne({
        where: {
          carType: carTypeName,
        },
        relations: {
          cars: true,
        },
      });
      if (!carType) return createError('Loại xe', 'Không tồn tại loại xe');
      return {
        ok: true,
        carType,
        numOfCars: carType.cars.length,
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
  async getCarTypes({
    pagination: { page, resultsPerPage },
  }: GetCarTypesInput): Promise<GetCarTypesOutput> {
    try {
      const [carTypes, totalResults] = await this.carTypeRepo.findAndCount({
        take: resultsPerPage,
        skip: (page - 1) * resultsPerPage,
        order: {
          carType: 'ASC',
        },
      });
      return {
        ok: true,
        carTypes,
        pagination: {
          totalPages: Math.ceil(totalResults / resultsPerPage),
          totalResults,
        },
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
  async UpdateCarType(input: UpdateCarTypeInput): Promise<UpdateCarTypeOutput> {
    try {
      const {
        acceptedPayment,
        price,
        procedures,
        additionalDistancePrice,
        maxDistance,
        carType: carTypeName,
      } = input;
      let carType = await this.carTypeRepo.findOne({
        where: {
          carType: carTypeName,
        },
      });
      if (!carType) return createError('Loại xe', 'Không tồn tại loại xe');
      carType = {
        ...carType,
        acceptedPayment,
        price,
        procedures,
        additionalDistancePrice: additionalDistancePrice || undefined,
        maxDistance: maxDistance || undefined,
      };
      await this.carTypeRepo.save(carType);
      return {
        ok: true,
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
}
