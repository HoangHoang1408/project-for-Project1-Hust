import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { StoredFile } from 'src/upload/Object/StoredFile';
import { Column, Entity } from 'typeorm';
import { CoreEntity } from '../../common/entities/core.entity';

export enum EngineType {
  GASOLINE = 'Xăng',
  ELECTRIC = 'Điện',
}
export enum VehicleType {
  CAR = 'CAR',
  MOTOR_BIKE = 'MOTOR_BIKE',
}
export enum Payment {
  BEFORE = 'Trả trước',
  AFTER = 'Trả sau',
  BANK_TRANSFER = 'Chuyển khoản',
}
registerEnumType(EngineType, {
  name: 'EngineType',
});
registerEnumType(VehicleType, { name: 'VehicleType' });
registerEnumType(Payment, { name: 'Payment' });

@ObjectType()
@InputType('VehicleStatusInputType')
export class VehicleStatus {
  @Field()
  vehicleNumber: number;

  @Field()
  booked: boolean;

  @Field()
  goodCondition: boolean;
}

@InputType('ProcedureInputType')
@ObjectType()
export class Procedure {
  @Field(() => [String], { nullable: true })
  mortgateProperty?: string[];

  @Field(() => [String], { nullable: true })
  mortgatePaper?: string[];

  @Field(() => [String], { nullable: true })
  verificationPaper?: string[];
}
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Entity()
export class Vehicle extends CoreEntity {
  @Field()
  @Column()
  name: string;

  @Field()
  @Column('numeric', { default: 5 })
  rating: number;

  @Field(() => EngineType)
  @Column('enum', {
    enum: EngineType,
  })
  engineType: EngineType;

  @Field()
  @Column()
  manufactureYear: number;

  @Field()
  @Column()
  price: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  maxDistance?: number;

  @Field()
  @Column()
  additionalDistancePrice: number;

  @Field(() => Procedure)
  @Column('simple-json')
  procedures: Procedure;

  @Field(() => [StoredFile], { nullable: true })
  @Column('json', { nullable: true })
  images: StoredFile[];

  @Field()
  @Column()
  totalQuantity: number;

  @Field(() => [VehicleStatus])
  @Column('json')
  vehicleStatuses: VehicleStatus[];

  @Field(() => [Payment])
  @Column('simple-json')
  acceptedPayment: Payment[];
}
