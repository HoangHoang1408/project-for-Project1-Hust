import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/output.dto';
import { SimpleUser, User } from 'src/user/entities/user.entity';

@InputType()
export class LoginInput extends PickType(User, ['email', 'password']) {}

@ObjectType()
export class LoginOutPut extends CoreOutput {
  @Field({ nullable: true })
  accessToken?: string;

  @Field(() => SimpleUser, { nullable: true })
  user?: SimpleUser;
}

@InputType()
export class NewAccessTokenInput {
  @Field()
  accessToken: string;
}

@ObjectType()
export class NewAccessTokenOutput extends CoreOutput {
  @Field({ nullable: true })
  accessToken?: string;
}
