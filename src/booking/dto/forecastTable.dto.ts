import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Car } from 'src/car/entities/car.entity';
import { CarTypeEnum } from 'src/car/entities/carType.entity';
import { CoreOutput } from 'src/common/dto/output.dto';
import { BookingStatus } from '../entities/booking.entity';

@ObjectType()
export class DayData {
  @Field(() => BookingStatus, { nullable: true })
  status?: BookingStatus;

  @Field(() => Date)
  day: Date;
}

@ObjectType()
export class TableRowData {
  @Field(() => Car)
  car: Car;

  @Field(() => [DayData])
  dayDatas: DayData[];

  @Field()
  rowSumary: string;
}

@InputType()
export class ForecastTableInput {
  @Field(() => CarTypeEnum)
  carType: CarTypeEnum;

  @Field(() => Date)
  startDate: Date;

  @Field(() => Date)
  endDate: Date;
}

@ObjectType()
export class ForecastTableOutput extends CoreOutput {
  @Field(() => [TableRowData], { nullable: true })
  tableData?: TableRowData[];
}
