import { Field, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/output.dto';

@ObjectType()
export class MeOutput extends CoreOutput {
  @Field()
  message: String;
}
