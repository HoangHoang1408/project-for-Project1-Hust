import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { range, sample, sampleSize } from 'lodash';
import {
  Car,
  CarBrand,
  EngineType,
  TransmissionType,
} from 'src/car/entities/car.entity';
import { CarType, CarTypeEnum, Payment } from 'src/car/entities/carType.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DataService {
  alphabet = range(26)
    .map((e) => [
      String.fromCharCode(e + 'a'.charCodeAt(0)),
      String.fromCharCode(e + 'A'.charCodeAt(0)),
    ])
    .flat();
  constructor(
    @InjectRepository(Car) private readonly carRepo: Repository<Car>,
    @InjectRepository(CarType)
    private readonly carTypeRepo: Repository<CarType>,
  ) {
    // this.insertCarData(15);
    // this.insertCarTypes()
  }
  async insertCarData(numOfCars: number) {
    const carBrands = Object.values(CarBrand);
    const transmissionTypes = Object.values(TransmissionType);
    const consumptions = range(20).map(
      () => Math.round((Math.random() * 8 + 2) * 10) / 10,
    );
    const engineTypes = Object.values(EngineType);
    const features = [
      'Điều hoà (A/C)',
      'Định vị (GPS)',
      'Bluetooth',
      'Khe cắm USB',
      'Camera lùi',
      'Nhận diện giọng nói',
      'Cảnh báo trộm',
      'Cảnh báo lệch làn',
      'Cảnh báo điểm mù',
    ];
    const manufactureYears = range(2014, 2022, 1);
    const carTypes = await this.carTypeRepo.find();
    const createCarRequests = range(numOfCars).map(async () => {
      const cb = sample(carBrands);
      const tempCar: Partial<Car> = {
        name: cb + ' ' + sampleSize(this.alphabet, 10).join(''),
        carBrand: cb,
        engineType: sample(engineTypes),
        manufactureYear: sample(manufactureYears),
        features: sampleSize(features, sample(range(1, features.length + 1))),
        transmissionType: sample(transmissionTypes),
        consumption: sample(consumptions),
        vehicleStatus: {
          booked: false,
          goodCondition: true,
        },
        licensePlate: sampleSize(this.alphabet, 12).join(''),
        carType: sample(carTypes),
      };
      await this.carRepo.save(this.carRepo.create(tempCar));
    });
    await Promise.all(createCarRequests);
  }
  async insertCarTypes() {
    const carTypes = Object.values(CarTypeEnum);
    const payments = Object.values(Payment);
    const objs = carTypes.map((ct) =>
      this.carTypeRepo.create({
        carType: ct,
        acceptedPayment: sampleSize(payments, 2),
        additionalDistancePrice: sample(range(5, 10)),
        maxDistance: sample(range(200, 1000, 100)),
        price: sample(range(500, 1000, 100)),
        procedures: {
          verificationPaper: ['CMND', 'Bằng lái xe'],
          mortgatePaper: ['Sổ hộ khẩu'],
          mortgateProperty: [
            'Tiền 15 triệu hoặc xe máy + đăng kí xe giá trị tương đương',
          ],
        },
      }),
    );
    await this.carTypeRepo.save(objs);
  }
}
