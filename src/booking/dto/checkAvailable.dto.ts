import { Field, ID, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/output.dto';
import { VehicleType } from 'src/vehicle/entities/vehicle.entity';
import { Booking } from '../entities/booking.entity';

@InputType()
export class CheckVehicleAvailableInput extends PickType(Booking, [
  'startDate',
  'endDate',
]) {
  @Field(() => VehicleType)
  vehicleType: VehicleType;

  @Field(() => ID)
  vehicleId: number;
}

@ObjectType()
export class CheckVehicleAvailableOutput extends CoreOutput {
  @Field({ nullable: true })
  available?: boolean;
}
