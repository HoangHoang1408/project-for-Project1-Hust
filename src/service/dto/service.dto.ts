import {
  Field,
  ID,
  InputType,
  ObjectType,
  OmitType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import {
  CoreOutput,
  PaginationInput,
  PaginationOutput,
} from 'src/common/dto/output.dto';
import { Service } from '../entities/service.entity';

@InputType()
export class CreateServiceInput extends PickType(Service, [
  'serviceName',
  'servicePrice',
  'description',
  'perDay',
]) {}

@ObjectType()
export class CreateServiceOutput extends CoreOutput {}

@InputType()
export class GetServiceInput {
  @Field(() => ID)
  id: number;
}

@ObjectType()
export class GetServiceOutput extends CoreOutput {
  @Field(() => Service, { nullable: true })
  service?: Service;
}

@InputType()
export class UpdateServiceInput extends PartialType(
  OmitType(Service, ['createdAt', 'updatedAt', 'id']),
) {
  @Field(() => ID)
  id: number;
}

@ObjectType()
export class UpdateServiceOutput extends CoreOutput {}

@InputType()
export class GetServicesByInput {
  @Field({ nullable: true })
  serviceName?: string;

  @Field(() => PaginationInput)
  pagination: PaginationInput;
}

@ObjectType()
export class GetServicesByOutput extends CoreOutput {
  @Field(() => PaginationOutput, { nullable: true })
  pagination?: PaginationOutput;

  @Field(() => [Service], { nullable: true })
  services?: Service[];
}
@InputType()
export class DeleteServiceInput {
  @Field(() => ID)
  id: number;
}

@ObjectType()
export class DeleteServiceOutput extends CoreOutput {}
