import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { range, sample, sampleSize } from 'lodash';
import {
  Car,
  CarBrand,
  CarType,
  TransmissionType,
} from 'src/vehicle/entities/car.entity';
import { MotorBike } from 'src/vehicle/entities/motobike.entity';
import {
  EngineType,
  Payment,
  VehicleStatus,
} from 'src/vehicle/entities/vehicle.entity';
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
    @InjectRepository(MotorBike)
    private readonly motorBikeRepo: Repository<MotorBike>,
  ) {
    // this.insertCarData(100);
  }
  async insertCarData(numOfCars: number) {
    const carBrands = Object.values(CarBrand);
    const carTypes = Object.values(CarType);
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
    const price = range(300, 1000, 100);
    const maxDistance = range(300, 1500, 100);
    const additionalDistancePrice = range(5, 25, 1);
    const totalQuantity = range(1, 10, 1);
    const payments = Object.values(Payment);
    const createCarRequests = range(numOfCars).map(async () => {
      const cb = sample(carBrands);
      const quantity = sample(totalQuantity);
      const tempCar: Partial<Car> = {
        name: cb + ' ' + sampleSize(this.alphabet, 10).join(''),
        carBrand: cb,
        engineType: sample(engineTypes),
        manufactureYear: sample(manufactureYears),
        price: sample(price),
        maxDistance: sample(maxDistance),
        additionalDistancePrice: sample(additionalDistancePrice),
        totalQuantity: quantity,
        features: sampleSize(features, sample(range(1, features.length + 1))),
        transmissionType: sample(transmissionTypes),
        consumption: sample(consumptions),
        carType: sample(carTypes),
        procedures: {
          verificationPaper: ['CMND', 'Bằng lái'],
          mortgatePaper: ['Sổ hộ khẩu'],
          mortgateProperty: ['Xe máy hoặc > 20 triệu tiền cọc'],
        },
        acceptedPayment: sampleSize<Payment>(
          payments,
          sample(range(1, payments.length + 1)),
        ),
        vehicleStatuses: range(quantity).map<VehicleStatus>((q) => {
          return {
            booked: false,
            goodCondition: true,
            vehicleNumber: q,
          };
        }),
      };
      await this.carRepo.save(this.carRepo.create(tempCar));
    });
    await Promise.all(createCarRequests);
  }
}
