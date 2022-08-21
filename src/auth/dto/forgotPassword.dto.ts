import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/output.dto';

@InputType()
export class ForgotPasswordInput {
  @Field()
  email: string;
}

@ObjectType()
export class ForgotPasswordOutput extends CoreOutput {}
