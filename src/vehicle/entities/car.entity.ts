import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { Booking } from 'src/booking/entities/booking.entity';
import { Column, Entity, OneToMany, Unique } from 'typeorm';
import { Vehicle } from './vehicle.entity';

export enum TransmissionType {
  MANUAL_TRANSMISSION = 'Số sàn',
  AUTOMATIC_TRANSMISSION = 'Số tự động',
}
export enum CarType {
  SEAT45 = 'Xe 4-5 chỗ',
  SEAT7 = 'Xe 7 chỗ',
  PICKUP_TRUCK = 'Xe bán tải',
  LUXURY_CAR = 'Xe hạng sang',
}
export enum CarBrand {
  VINFAST = 'Vinfast',
  TOYOTA = 'Toyota',
  HUYNDAI = 'Huyndai',
  FORD = 'Ford',
  HONDA = 'Honda',
  NISSAN = 'Nissan',
  SUZUKI = 'Suzuki',
  VOLVO = 'Volvo',
}

registerEnumType(TransmissionType, { name: 'TransmissionType' });
registerEnumType(CarType, { name: 'CarType' });
registerEnumType(CarBrand, { name: 'CarBrand' });

@InputType('CarInputType', { isAbstract: true })
@ObjectType()
@Entity()
@Unique(['carType', 'engineType', 'manufactureYear', 'name'])
export class Car extends Vehicle {
  @Field(() => CarType)
  @Column('enum', { enum: CarType })
  carType: CarType;

  @Field(() => CarBrand)
  @Column('enum', { enum: CarBrand })
  carBrand: CarBrand;

  @Field(() => TransmissionType)
  @Column('enum', {
    enum: TransmissionType,
  })
  transmissionType: TransmissionType;

  @Field()
  @Column('float')
  consumption: number;

  @Field(() => [String])
  @Column('simple-array')
  features: string[];


  @Field(() => [Booking], { nullable: true })
  @OneToMany(() => Booking, (cb) => cb.car, { nullable: true })
  bookings?: Booking[];
}
