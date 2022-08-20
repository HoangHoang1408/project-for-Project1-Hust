import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsPhoneNumber, IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity } from 'typeorm';

export enum UserRole {
  Normal = 'Normal',
  Admin = 'Admin',
}

@ObjectType()
@InputType({ isAbstract: true })
@Entity()
export class User extends CoreEntity {
  @Field()
  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Field()
  @Column({ default: false })
  verified: boolean;

  @Field()
  @Column({ select: false })
  @IsString()
  password: string;

  @Field()
  @Column()
  @IsString()
  name: string;

  @Field(() => UserRole)
  @Column('enum', {
    enum: UserRole,
  })
  role: UserRole;

  @Field({ nullable: true })
  @Column({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  @IsPhoneNumber()
  phoneNumber?: string;
}
