import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity } from 'typeorm';

@InputType('ServiceInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Service extends CoreEntity {
  @Field()
  @Column()
  serviceName: string;

  @Field()
  @Column()
  servicePrice: number;

  @Field()
  @Column()
  description: string;

  @Field()
  @Column()
  perDay: boolean;
}
