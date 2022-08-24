import {
  Field,
  ID,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { compare, hash } from 'bcrypt';
import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Booking } from 'src/booking/entities/booking.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import { StoredFile } from 'src/upload/Object/StoredFile';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
export enum UserRole {
  Normal = 'Normal',
  Admin = 'Admin',
}
registerEnumType(UserRole, {
  name: 'UserRole',
});

@InputType('UserInputType', { isAbstract: true })
@ObjectType()
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
  @IsPhoneNumber('VN')
  @IsOptional()
  phoneNumber?: string;

  @Field(() => StoredFile, { nullable: true })
  @Column('json', { nullable: true })
  @ValidateNested()
  avatar?: StoredFile;

  @Field(() => [Booking], { nullable: true })
  @OneToMany(() => Booking, (cb) => cb.user, { nullable: true, lazy: true })
  bookings?: Promise<Booking[]>;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (!this.password) return;
    console.log(this.password);
    this.password = await hash(this.password, 12);
  }

  async checkPassword(password): Promise<Boolean> {
    return await compare(password, this.password);
  }
}
@ObjectType()
export class SimpleUser {
  @Field(() => ID)
  id: number;

  @Field()
  email: string;

  @Field()
  name: string;

  @Field(() => UserRole)
  role: UserRole;
}
