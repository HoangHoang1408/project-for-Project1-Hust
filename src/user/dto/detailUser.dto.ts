import { Field, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/output.dto';
import { User } from '../entities/user.entity';

@ObjectType()
export class GetDetailUserOutput extends CoreOutput {
  @Field(() => User)
  user: User;
}
