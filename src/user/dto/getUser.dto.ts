import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  CoreOutput,
  PaginationInput,
  PaginationOutput,
} from 'src/common/dto/output.dto';
import { User, UserRole } from '../entities/user.entity';

@InputType()
export class GetUserByInput {
  @Field(() => UserRole, { nullable: true })
  role?: UserRole;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  phoneNumber?: string;

  @Field(() => PaginationInput)
  pagination: PaginationInput;
}

@ObjectType()
export class GetUserByOutput extends CoreOutput {
  @Field(() => [User], { nullable: true })
  users?: User[];

  @Field(() => PaginationOutput, { nullable: true })
  pagination?: PaginationOutput;
}
