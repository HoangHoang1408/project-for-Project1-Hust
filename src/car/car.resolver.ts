import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Roles } from 'src/auth/role.decorator';
import { CarService } from './car.service';
import {
  CreateCarInput,
  CreateCarOutput,
  GetCarDetailInput,
  GetCarDetailOutput,
  GetCarsByInput,
  GetCarsByOutput,
  GetCarTypeInput,
  GetCarTypeOutput,
  UpdateCarInput,
  UpdateCarOutput,
} from './dto/car.dto';

@Resolver()
export class CarResolver {
  constructor(private readonly carService: CarService) {}
  @Roles(['Admin'])
  @Mutation(() => CreateCarOutput)
  createCar(@Args('input') input: CreateCarInput) {
    return this.carService.createCar(input);
  }

  @Query(() => GetCarDetailOutput)
  getCarDetail(@Args('input') input: GetCarDetailInput) {
    return this.carService.getCarDetail(input);
  }

  @Query(() => GetCarTypeOutput)
  getCarType(@Args('input') input: GetCarTypeInput) {
    return this.carService.getCarType(input);
  }

  @Query(() => GetCarsByOutput)
  getCarsBy(@Args('input') input: GetCarsByInput) {
    return this.carService.getCarsBy(input);
  }

  @Roles(['Admin'])
  @Mutation(() => UpdateCarOutput)
  updateCar(@Args('input') input: UpdateCarInput) {
    return this.carService.updateCar(input);
  }
}
