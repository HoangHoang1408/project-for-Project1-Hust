import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { IsNumberString } from 'class-validator';
import { CarTypeEnum } from 'src/car/entities/carType.entity';
import { CoreOutput } from 'src/common/dto/output.dto';
import { Booking } from '../entities/booking.entity';

@InputType()
export class CheckCarAvailableInput extends PickType(Booking, [
  'startDate',
  'endDate',
]) {
  @Field(() => CarTypeEnum)
  carType: CarTypeEnum;

  @Field(() => Number)
  quantity: string;
}

@ObjectType()
export class CheckCarAvailableOutput extends CoreOutput {
  @Field({ nullable: true })
  available?: boolean;
}
