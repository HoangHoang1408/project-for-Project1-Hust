import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/output.dto';
import { User } from '../entities/user.entity';

@InputType()
export class UpdateUserInput extends PickType(User, [
  'address',
  'name',
  'phoneNumber',
  'avatar',
]) {}

@ObjectType()
export class UpdateUserOutput extends CoreOutput {}
