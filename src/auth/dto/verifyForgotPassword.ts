import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/output.dto';

@InputType()
export class VerifyForgotPasswordInput {
  @Field()
  verificationToken: string;

  @Field()
  password: string;

  @Field()
  confirmPassword: string;
}

@ObjectType()
export class VerifyForgotPasswordOutput extends CoreOutput {}
