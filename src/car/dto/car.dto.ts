import {
  Field,
  ID,
  InputType,
  ObjectType,
  OmitType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { IsDate, IsOptional, ValidateNested } from 'class-validator';
import {
  CoreOutput,
  PaginationInput,
  PaginationOutput,
} from 'src/common/dto/output.dto';
import { Car, VehicleStatus } from '../entities/car.entity';
import { CarType } from '../entities/carType.entity';

@InputType()
export class CreateCarInput extends OmitType(Car, [
  'createdAt',
  'id',
  'rating',
  'updatedAt',
  'vehicleStatus',
]) {}

@ObjectType()
export class CreateCarOutput extends CoreOutput {}

@InputType()
export class GetCarDetailInput {
  @Field(() => ID)
  carId: number;
}

@ObjectType()
export class GetCarDetailOutput extends CoreOutput {
  @Field(() => Car, { nullable: true })
  car?: Car;
}

@InputType()
export class GetCarsByInput extends PartialType(
  PickType(Car, ['transmissionType', 'carBrand', 'engineType']),
) {
  @Field(() => Date, { nullable: true })
  @IsDate()
  @IsOptional()
  startDate?: Date;

  @Field(() => Date, { nullable: true })
  @IsDate()
  @IsOptional()
  endDate?: Date;

  @Field(() => PaginationInput)
  @ValidateNested()
  pagination: PaginationInput;
}

@ObjectType()
export class GetCarsByOutput extends CoreOutput {
  @Field(() => [Car], { nullable: true })
  cars?: Car[];

  @Field(() => PaginationOutput, { nullable: true })
  pagination?: PaginationOutput;
}

@InputType()
export class UpdateCarInput extends PartialType(CreateCarInput) {
  @Field(() => ID)
  carId: number;

  @Field(() => VehicleStatus, { nullable: true })
  vehicleStatus?: VehicleStatus;
}

@ObjectType()
export class UpdateCarOutput extends CoreOutput {}

@InputType()
export class DeleteCarInput {
  @Field(() => ID)
  carId: number;
}

@ObjectType()
export class DeleteCarOutput extends CoreOutput {}

@InputType()
export class GetCarTypeInput extends PickType(CarType, ['carType']) {}
@ObjectType()
export class GetCarTypeOutput extends CoreOutput {
  @Field(() => CarType, { nullable: true })
  carType?: CarType;
}
