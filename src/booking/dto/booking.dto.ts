import {
  Field,
  ID,
  InputType,
  Int,
  ObjectType,
  PickType,
} from '@nestjs/graphql';
import { CarTypeEnum } from 'src/car/entities/carType.entity';
import {
  CoreOutput,
  PaginationInput,
  PaginationOutput,
} from 'src/common/dto/output.dto';
import { Booking } from '../entities/booking.entity';
@InputType()
export class CreateBookingInput extends PickType(Booking, [
  'startDate',
  'endDate',
  'homeDelivery',
  'note',
  'payment',
  'quantity',
  'customerName',
  'customerPhone',
]) {
  @Field(() => CarTypeEnum)
  carTypeName: CarTypeEnum;
}

@ObjectType()
export class CreateBookingOutput extends CoreOutput {
  @Field({ nullable: true })
  bookingCode?: string;
}

@InputType()
export class UpdateBookingStatusInput extends PickType(Booking, ['status']) {
  @Field(() => Int)
  bookingId: number;
}
@ObjectType()
export class UpdateBookingStatusOutput extends CoreOutput {}

@InputType()
export class GetBookingDetailInput {
  @Field(() => ID)
  bookingId: number;
}
@ObjectType()
export class GetBookingDetailOutput extends CoreOutput {
  @Field(() => Booking, { nullable: true })
  booking?: Booking;
}

@InputType()
export class GetBookingsByInput {
  @Field(() => CarTypeEnum, { nullable: true })
  carType?: CarTypeEnum;

  @Field(() => Date, { nullable: true })
  startDate?: Date;

  @Field(() => Date, { nullable: true })
  endDate?: Date;

  @Field(() => PaginationInput)
  pagination: PaginationInput;
}
@ObjectType()
export class GetBookingsByOutput extends CoreOutput {
  @Field(() => [Booking], { nullable: true })
  bookings?: Booking[];

  @Field(() => PaginationOutput, { nullable: true })
  pagination?: PaginationOutput;
}

@InputType()
export class BookingFeedBackInput extends PickType(Booking, ['id']) {
  @Field(() => Int)
  rating: number;

  @Field({ nullable: true })
  feedback?: string;
}
@ObjectType()
export class BookingFeedBackOutput extends CoreOutput {}
