import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { Booking } from 'src/booking/entities/booking.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { TransmissionType } from './car.entity';
import { Vehicle } from './vehicle.entity';
export enum MotorBikeTransmissionType {
  MANUAL_TRANSMISSION = 'Xe số',
  AUTOMATIC_TRANSMISSION = 'Xe ga',
  MANUAL_CLUTCH = 'Xe côn',
}
export enum MotorBikeBrand {
  VINFAST = 'Vinfast',
  HONDA = 'Honda',
  DUCATI = 'DUCATI',
  SYW = 'SWM',
  SUZUKI = 'SUZUKI',
  YAMAHA = 'YAMAHA',
}
registerEnumType(MotorBikeBrand, { name: 'MotorBikeBrand' });
registerEnumType(MotorBikeTransmissionType, {
  name: 'MotorBikeTransmissionType',
});
@InputType('MotorBikeInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class MotorBike extends Vehicle {
  @Field(() => [Booking], { nullable: true })
  @OneToMany(() => Booking, (cb) => cb.motorBike, { nullable: true })
  bookings?: Booking[];

  @Field(() => TransmissionType)
  @Column('enum', { enum: MotorBikeTransmissionType })
  transmissionType: MotorBikeTransmissionType;

  @Field(() => MotorBikeBrand)
  @Column('enum', { enum: MotorBikeBrand })
  motorBikeBrand: MotorBikeBrand;
}
