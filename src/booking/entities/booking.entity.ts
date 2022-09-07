import {
  Field,
  InputType,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsDate, IsPhoneNumber } from 'class-validator';
import { Car } from 'src/car/entities/car.entity';
import { CarType, Payment } from 'src/car/entities/carType.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  RelationId,
} from 'typeorm';

export enum BookingStatus {
  NOT_DEPOSITE = 'Chưa cọc',
  DEPOSITED = 'Đã cọc',
  VEHICLE_TAKEN = 'Đã nhận xe',
  FINISHED = 'Đã trả xe',
  CANCEL = 'Huỷ',
}
registerEnumType(BookingStatus, { name: 'BookingStatus' });

@InputType('BookingInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Booking extends CoreEntity {
  @Field()
  @Column()
  bookingCode: string;

  @Field()
  @Column()
  homeDelivery: string;

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

  @Field(() => Payment)
  @Column('enum', { enum: Payment })
  payment: Payment;

  @Field(() => BookingStatus)
  @Column('enum', { enum: BookingStatus })
  status: BookingStatus;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  rating: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  feedBack: string;

  @Field(() => [Car])
  @ManyToMany(() => Car)
  @JoinTable()
  cars: Car[];

  @Field()
  @Column()
  quantity: number;

  @Field(() => CarType)
  @ManyToOne(() => CarType, { eager: true })
  carType: CarType;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User)
  user?: User;

  @RelationId((booking: Booking) => booking.user)
  userId: number;

  @Field()
  @Column()
  customerName: string;

  @Field()
  @Column()
  @IsPhoneNumber('VN')
  customerPhone: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  note: string;
}
