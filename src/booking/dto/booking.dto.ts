import {
  Field,
  ID,
  InputType,
  Int,
  ObjectType,
  PickType,
} from '@nestjs/graphql';
import {
  CoreOutput,
  PaginationInput,
  PaginationOutput,
} from 'src/common/dto/output.dto';
import { VehicleType } from 'src/vehicle/entities/vehicle.entity';
import { Booking } from '../entities/booking.entity';
@InputType()
export class CreateBookingInput extends PickType(Booking, [
  'startDate',
  'endDate',
  'homeDelivery',
  'note',
  'payment',
  'vehicleType',
]) {
  @Field(() => ID)
  vehicleId: number;
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
  @Field(() => Date, { nullable: true })
  startDate?: Date;

  @Field(() => Date, { nullable: true })
  endDate?: Date;

  @Field(() => VehicleType)
  vehicleType: VehicleType;

  @Field(() => PaginationInput, { nullable: true })
  pagination?: PaginationInput;
}
@ObjectType()
export class GetBookingsByOutput extends CoreOutput {
  @Field(() => [Booking], { nullable: true })
  bookings?: Booking[];

  @Field(() => PaginationOutput, { nullable: true })
  pagination?: PaginationOutput;
}
