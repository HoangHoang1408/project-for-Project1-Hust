import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Roles } from 'src/auth/role.decorator';
import {
  CreateCarInput,
  CreateCarOutput,
  DeleteCarInput,
  DeleteCarOutput,
  GetCarDetailInput,
  GetCarDetailOutput,
  GetCarsByInput,
  GetCarsByOutput,
  UpdateCarInput,
  UpdateCarOutput,
} from './dto/car.dto';
import {
  CreateMotorBikeInput,
  CreateMotorBikeOutput,
  DeleteMotorBikeInput,
  DeleteMotorBikeOutput,
  GetMotorBikeDetailInput,
  GetMotorBikeDetailOutput,
  GetMotorBikesByInput,
  GetMotorBikesByOutput,
  UpdateMotorBikeInput,
  UpdateMotorBikeOutput,
} from './dto/motorbike.dto';
import { VehicleService } from './vehicle.service';

@Resolver()
export class VehicleResolver {
  constructor(private readonly vehicleService: VehicleService) {}

  @Roles(['Admin'])
  @Mutation(() => CreateCarOutput)
  createCar(@Args('input') input: CreateCarInput) {
    return this.vehicleService.createCar(input);
  }

  @Query(() => GetCarDetailOutput)
  getCarDetail(@Args('input') input: GetCarDetailInput) {
    return this.vehicleService.getCarDetail(input);
  }

  @Query(() => GetCarsByOutput)
  getCarsBy(@Args('input') input: GetCarsByInput) {
    return this.vehicleService.getCarsBy(input);
  }

  @Roles(['Admin'])
  @Mutation(() => UpdateCarOutput)
  updateCar(@Args('input') input: UpdateCarInput) {
    return this.vehicleService.updateCar(input);
  }

  @Roles(['Admin'])
  @Mutation(() => DeleteCarOutput)
  deleteCar(@Args('input') input: DeleteCarInput) {
    return this.vehicleService.deleteCar(input);
  }

  @Roles(['Admin'])
  @Mutation(() => CreateMotorBikeOutput)
  createMotorBike(@Args('input') input: CreateMotorBikeInput) {
    return this.vehicleService.createMotorBike(input);
  }

  @Query(() => GetMotorBikeDetailOutput)
  getMotorBikeDetail(@Args('input') input: GetMotorBikeDetailInput) {
    return this.vehicleService.getMotorBikeDetail(input);
  }

  @Query(() => GetMotorBikesByOutput)
  getMotorBikesBy(@Args('input') input: GetMotorBikesByInput) {
    return this.vehicleService.getMotorBikesBy(input);
  }

  @Roles(['Admin'])
  @Mutation(() => UpdateMotorBikeOutput)
  updateMotorBike(@Args('input') input: UpdateMotorBikeInput) {
    return this.vehicleService.updateMotorBike(input);
  }

  @Roles(['Admin'])
  @Mutation(() => DeleteMotorBikeOutput)
  deleteMotorBike(@Args('input') input: DeleteMotorBikeInput) {
    return this.vehicleService.deleteMotorBike(input);
  }
}
