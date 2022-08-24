import {
  Field,
  ID,
  InputType,
  ObjectType,
  OmitType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { ValidateNested } from 'class-validator';
import {
  CoreOutput,
  PaginationInput,
  PaginationOutput,
} from 'src/common/dto/output.dto';
import { MotorBike } from '../entities/motobike.entity';

@InputType()
export class CreateMotorBikeInput extends OmitType(MotorBike, [
  'id',
  'createdAt',
  'updatedAt',
]) {}

@ObjectType()
export class CreateMotorBikeOutput extends CoreOutput {}

@InputType()
export class GetMotorBikeDetailInput {
  @Field(() => ID)
  motorBikeId: number;
}

@ObjectType()
export class GetMotorBikeDetailOutput extends CoreOutput {
  @Field(() => MotorBike, { nullable: true })
  motorBike?: MotorBike;
}

@InputType()
export class GetMotorBikesByInput extends PartialType(
  PickType(MotorBike, ['engineType']),
) {
  @Field(() => Date, { nullable: true })
  startDate?: Date;

  @Field(() => Date, { nullable: true })
  endDate?: Date;

  @Field(() => PaginationInput)
  @ValidateNested()
  pagination: PaginationInput;
}

@ObjectType()
export class GetMotorBikesByOutput extends CoreOutput {
  @Field(() => [MotorBike], { nullable: true })
  motorBikes?: MotorBike[];

  @Field(() => PaginationOutput, { nullable: true })
  pagination?: PaginationOutput;
}

@InputType()
export class UpdateMotorBikeInput extends PartialType(CreateMotorBikeInput) {
  @Field(() => ID)
  motorBikeId: number;
}

@ObjectType()
export class UpdateMotorBikeOutput extends CoreOutput {}

@InputType()
export class DeleteMotorBikeInput {
  @Field(() => ID)
  motorBikeId: number;
}

@ObjectType()
export class DeleteMotorBikeOutput extends CoreOutput {}
