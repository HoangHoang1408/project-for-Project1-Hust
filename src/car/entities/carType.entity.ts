import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { Booking } from 'src/booking/entities/booking.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, OneToMany, Unique } from 'typeorm';
import { Car } from './car.entity';
export enum CarTypeEnum {
  SEAT4 = 'Xe 4 chỗ',
  SEAT5 = 'Xe 5 chỗ',
  SEAT7 = 'Xe 7 chỗ',
  PICKUP_TRUCK = 'Xe bán tải',
  LUXURY_CAR = 'Xe hạng sang',
}
export enum Payment {
  BEFORE = 'Trả trước',
  AFTER = 'Trả sau',
  BANK_TRANSFER = 'Chuyển khoản',
}
registerEnumType(CarTypeEnum, { name: 'CarTypeEnum' });
registerEnumType(Payment, { name: 'Payment' });

@InputType('ProcedureInputType')
@ObjectType()
export class Procedure {
  @Field(() => [String], { nullable: true })
  mortgateProperty?: string[];

  @Field(() => [String], { nullable: true })
  mortgatePaper?: string[];

  @Field(() => [String], { nullable: true })
  verificationPaper?: string[];
}

@InputType('CarTypeInput')
@ObjectType()
@Entity()
@Unique(['carType'])
export class CarType extends CoreEntity {
  @Field(() => CarTypeEnum)
  @Column('enum', { enum: CarTypeEnum })
  carType: CarTypeEnum;

  @Field()
  @Column()
  price: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  maxDistance?: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  additionalDistancePrice?: number;

  @Field(() => Procedure)
  @Column('simple-json')
  procedures: Procedure;

  @Field(() => [Payment])
  @Column('simple-json')
  acceptedPayment: Payment[];

  @Field(() => [Car], { nullable: true })
  @OneToMany(() => Car, (c) => c.carType, { nullable: true })
  cars?: Car[];

  @Field(() => [Booking], { nullable: true })
  @OneToMany(() => Booking, (b) => b.carType, { nullable: true })
  bookings?: Booking[];
}
