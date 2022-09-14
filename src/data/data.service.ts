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
import { Service } from 'src/service/entities/service.entity';
import { StoredFile } from 'src/upload/Object/StoredFile';
import { User, UserRole } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
const carImages: StoredFile[][] = [
  [
    {
      fileUrl:
        'https://ssa-api.toyotavn.com.vn/Resources/Images/028A2C4C8E50A9184083E2A47960400E.jpg',
      filePath: '',
    },
    {
      fileUrl:
        'https://iv.vnecdn.net/vnexpress/images/web/2021/04/16/review-toyta-vios-sua-1618560781_500x300.jpg',
      filePath: '',
    },
    {
      fileUrl:
        'https://cdnimg.vietnamplus.vn/uploaded/qrndqxjwp/2021_02_23/toyota_vios_white_0b.jpg',
      filePath: '',
    },
  ],
  [
    {
      fileUrl:
        'https://cdn.24hmoney.vn/upload/images_cr/2019-10-26/images/uploaded/share/2019/10/26/d5cvinfast-lux-a-1-width497height280.jpg',
      filePath: '',
    },
    {
      fileUrl:
        'https://giaxevinfastvinhphuc.com/wp-content/uploads/2021/03/Vinfast-Lux-A-5.jpg',
      filePath: '',
    },
    {
      fileUrl:
        'https://danangtravelcar.com.vn/wp-content/uploads/2019/12/vinfast-2.jpg',
      filePath: '',
    },
  ],
  [
    {
      fileUrl:
        'https://ford-hcm.com/upload/detail/2021/09/images/ford-ranger-xls-at.jpg',
      filePath: '',
    },
    {
      fileUrl:
        'https://vinaford.com/wp-content/uploads/2021/07/xe-ford-ranger-limited-2022-mau-nau-moi-5.jpg',
      filePath: '',
    },
    {
      fileUrl:
        'https://znews-photo.zingcdn.me/w660/Uploaded/abhuuwo/2021_11_24/2022_Ford_Ranger_4_.jpg',
      filePath: '',
    },
  ],
  [
    {
      fileUrl:
        'https://thuexelimousine9cho.com/wp-content/uploads/2021/08/thue-xe-limousine-12-cho-4.jpg',
      filePath: '',
    },
    {
      fileUrl:
        'https://www.xedulichvietnam.com/wp-content/uploads/2020/09/Thuê-xe-limousine-1-1024x768-1.jpg',
      filePath: '',
    },
  ],
  [
    {
      fileUrl:
        'https://giaxenhap.com/wp-content/uploads/2020/06/thumb-toyota-camry-1.jpg',
      filePath: '',
    },
    {
      fileUrl:
        'https://toyotalongxuyen.net/wp-content/uploads/2021/01/213B32FD650C365174F84473FBF91D91.png',
      filePath: '',
    },
  ],
];
const services: {
  serviceName: string;
  description: string;
  servicePrice: number;
}[] = [
  {
    serviceName: 'Thuê lái xe',
    description: 'Thuê thêm lái xe để phục vụ di chuyển',
    servicePrice: 300000,
  },
  {
    serviceName: 'Xe hoa',
    description: 'Trang trí xe để phù hợp với sự kiện cưới hỏi',
    servicePrice: 200000,
  },
];
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
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,
    @InjectRepository(CarType)
    private readonly carTypeRepo: Repository<CarType>,
  ) {
    if (process.env.INSERT_CARTYPE) this.insertCarTypes();
    if (process.env.INSERT_CARS) this.insertCarData(60);
    if (process.env.INSERT_ADMIN) this.insertAdmin(5);
    if (process.env.INSERT_SERVICE) this.insertServices();
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
        name: cb + ' ' + sampleSize(this.alphabet, 2).join(''),
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
        licensePlate:
          '30A-' +
          sampleSize(range(0, 10).join(''), 3).join('') +
          '.' +
          sampleSize(range(0, 10).join(''), 2).join(''),
        carType: sample(carTypes),
        images: sample(carImages),
      };
      await this.carRepo.save(this.carRepo.create(tempCar));
    });
    await Promise.all(createCarRequests);
  }
  async insertCarTypes() {
    const carTypes = Object.values(CarTypeEnum);
    const objs = carTypes.map((ct) =>
      this.carTypeRepo.create({
        carType: ct,
        acceptedPayment: [Payment.BANK_TRANSFER],
        additionalDistancePrice: sample(range(5, 10)) * 1000,
        maxDistance: sample(range(200, 800, 100)),
        price: sample(range(300, 800, 100)) * 1000,
        procedures: {
          verificationPaper: ['CMND', 'Bằng lái xe'],
          mortgatePaper: ['Sổ hộ khẩu'],
          mortgateProperty: [],
        },
      }),
    );
    await this.carTypeRepo.save(objs);
  }
  async insertAdmin(num: number) {
    const temp = range(num).map(() =>
      this.userRepo.save(
        this.userRepo.create({
          name: 'admin',
          email:
            'admin' +
            sampleSize(range(0, 10).join(''), 5).join('') +
            '@gmail.com',
          password: 'password',
          role: UserRole.Admin,
          verified: true,
        }),
      ),
    );
    await Promise.all(temp);
  }
  async insertServices() {
    await this.serviceRepo.save(
      services.map(({ description, serviceName, servicePrice }) =>
        this.serviceRepo.create({
          serviceName,
          description,
          servicePrice,
        }),
      ),
    );
  }
}
