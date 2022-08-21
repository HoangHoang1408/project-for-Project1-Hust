import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/output.dto';

@InputType()
export class VerifyEmailInput {
  @Field()
  verificationToken: string;
}

@ObjectType()
export class VerifyEmailOutput extends CoreOutput {}
