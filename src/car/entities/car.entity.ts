import {
  Field,
  InputType,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { Booking } from 'src/booking/entities/booking.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import { StoredFile } from 'src/upload/Object/StoredFile';
import { Column, Entity, ManyToMany, ManyToOne, Unique } from 'typeorm';
import { CarType } from './carType.entity';

export enum TransmissionType {
  MANUAL_TRANSMISSION = 'Số sàn',
  AUTOMATIC_TRANSMISSION = 'Số tự động',
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
export enum EngineType {
  GASOLINE = 'Xăng',
  ELECTRIC = 'Điện',
  HIBRID = 'Hỗn hop',
}
export enum VehicleType {
  CAR = 'CAR',
  MOTOR_BIKE = 'MOTOR_BIKE',
}

registerEnumType(EngineType, {
  name: 'EngineType',
});
registerEnumType(VehicleType, { name: 'VehicleType' });
registerEnumType(TransmissionType, { name: 'TransmissionType' });
registerEnumType(CarBrand, { name: 'CarBrand' });

@ObjectType()
@InputType('VehicleStatusInputType')
export class VehicleStatus {
  @Field()
  booked: boolean;

  @Field()
  goodCondition: boolean;
}

@InputType('CarInputType', { isAbstract: true })
@ObjectType()
@Entity()
@Unique(['engineType', 'manufactureYear', 'name', 'licensePlate'])
export class Car extends CoreEntity {
  @Field()
  @Column()
  name: string;

  @Field()
  @Column('numeric', { default: 5 })
  rating: number;

  @Field(() => EngineType)
  @Column('enum', {
    enum: EngineType,
  })
  engineType: EngineType;

  @Field(() => Int)
  @Column()
  manufactureYear: number;

  @Field(() => [StoredFile], { nullable: true })
  @Column('json', { nullable: true })
  images: StoredFile[];

  @Field()
  @Column()
  licensePlate: string;

  @Field(() => VehicleStatus)
  @Column('json')
  vehicleStatus: VehicleStatus;

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

  @Field(() => CarType)
  @ManyToOne(() => CarType, (ct) => ct.cars, {})
  carType: CarType;

  @Field(() => [Booking], { nullable: true })
  @ManyToMany(() => Booking, (booking) => booking.cars, { nullable: true })
  bookings?: Booking[];
}
