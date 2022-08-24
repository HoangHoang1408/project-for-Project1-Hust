import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsDate } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from 'src/user/entities/user.entity';
import { Car } from 'src/vehicle/entities/car.entity';
import { MotorBike } from 'src/vehicle/entities/motobike.entity';
import { Payment, VehicleType } from 'src/vehicle/entities/vehicle.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';

export enum BookingStatus {
  PENDING = 'PENDING',
  VEHICLE_TAKEN = 'VEHICLE_TAKEN',
  FINISHED = 'FINISHED',
}
registerEnumType(BookingStatus, { name: 'BookingStatus' });

@InputType('BookingInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Booking extends CoreEntity {
  @Field()
  @Column()
  bookingCode: string;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User)
  user?: User;

  @RelationId((booking: Booking) => booking.user)
  userId: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  homeDelivery?: string;

  @Field(() => Date)
  @Column('timestamp without time zone')
  @IsDate()
  startDate: Date;

  @Field(() => Date)
  @Column('timestamp without time zone')
  @IsDate()
  endDate: Date;

  @Field()
  @Column()
  totalPrice: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  note: string;

  @Field(() => Payment)
  @Column('enum', { enum: Payment })
  payment: Payment;

  @Field(() => BookingStatus)
  @Column('enum', { enum: BookingStatus })
  status: BookingStatus;

  @Field({ nullable: true })
  @Column({ nullable: true })
  rating: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  feedBack: string;

  @Field(() => VehicleType)
  @Column('enum', { enum: VehicleType })
  vehicleType: VehicleType;

  @Field(() => Car, { nullable: true })
  @ManyToOne(() => Car, { nullable: true })
  car?: Car;

  @RelationId((booking: Booking) => booking.car)
  carId?: number;

  @Field(() => MotorBike, { nullable: true })
  @ManyToOne(() => MotorBike, { nullable: true })
  motorBike?: MotorBike;

  @RelationId((booking: Booking) => booking.motorBike)
  motorBikeId?: number;

  @Column()
  vehicleNumber: number;
}
