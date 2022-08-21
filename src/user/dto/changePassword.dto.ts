import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/output.dto';
import { User } from '../entities/user.entity';

@InputType()
export class ChangePasswordInput extends PickType(User, ['password']) {
  @Field()
  currentPassword: string;
  
  @Field()
  confirmPassword: string;
}

@ObjectType()
export class ChangePasswordOutput extends CoreOutput {}
