import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { IsEnum } from 'class-validator';
import { CoreOutput } from 'src/common/dto/output.dto';
import { User, UserRole } from 'src/user/entities/user.entity';

@InputType()
export class SignUpInput extends PickType(User, ['email', 'name', 'password']) {
  @Field(() => UserRole)
  @IsEnum(UserRole)
  role: UserRole;

  @Field()
  confirmPassword: string;
}
@ObjectType()
export class SignUpOutPut extends CoreOutput {}
