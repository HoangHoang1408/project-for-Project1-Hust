import {
  Field,
  ID,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { ValidateNested } from 'class-validator';
import {
  CoreOutput,
  PaginationInput,
  PaginationOutput,
} from 'src/common/dto/output.dto';
import { Car, CarBrand, VehicleStatus } from '../entities/car.entity';
import {
  CarType,
  CarTypeEnum,
  Payment,
  Procedure,
} from '../entities/carType.entity';

@InputType()
export class CreateCarInput extends PickType(Car, [
  'carBrand',
  'consumption',
  'engineType',
  'features',
  'images',
  'licensePlate',
  'manufactureYear',
  'name',
  'transmissionType',
]) {
  @Field(() => CarTypeEnum, { nullable: true })
  carType: CarTypeEnum;
}

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
export class GetCarsByInput {
  @Field(() => CarTypeEnum, { nullable: true })
  carType?: CarTypeEnum;

  @Field(() => CarBrand, { nullable: true })
  carBrand?: CarBrand;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  licensePlate?: string;

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
  @Field({ nullable: true })
  numOfCars?: number;
}

@InputType()
export class GetCarTypesInput {
  @Field(() => PaginationInput)
  pagination: PaginationInput;
}
@ObjectType()
export class GetCarTypesOutput extends CoreOutput {
  @Field(() => [CarType], { nullable: true })
  carTypes?: CarType[];

  @Field(() => PaginationOutput, { nullable: true })
  pagination?: PaginationOutput;
}

@InputType()
export class UpdateCarTypeInput {
  @Field(() => CarTypeEnum)
  carType: CarTypeEnum;

  @Field()
  price: number;

  @Field({ nullable: true })
  maxDistance?: number;

  @Field({ nullable: true })
  additionalDistancePrice?: number;

  @Field(() => Procedure)
  procedures: Procedure;

  @Field(() => [Payment])
  acceptedPayment: Payment[];
}
@ObjectType()
export class UpdateCarTypeOutput extends CoreOutput {}
