import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Roles } from 'src/auth/role.decorator';
import {
  CreateServiceInput,
  CreateServiceOutput,
  DeleteServiceInput,
  DeleteServiceOutput,
  GetServiceInput,
  GetServiceOutput,
  GetServicesByInput,
  GetServicesByOutput,
  UpdateServiceInput,
  UpdateServiceOutput,
} from './dto/service.dto';
import { Service } from './entities/service.entity';
import { ServiceService } from './service.service';

@Resolver(() => Service)
export class ServiceResolver {
  constructor(private readonly serviceService: ServiceService) {}

  @Roles(['Admin'])
  @Mutation(() => CreateServiceOutput)
  createService(@Args('input') input: CreateServiceInput) {
    return this.serviceService.createService(input);
  }

  @Query(() => GetServiceOutput)
  getService(@Args('input') input: GetServiceInput) {
    return this.serviceService.getServiceDetail(input);
  }

  @Query(() => GetServicesByOutput)
  getServices(@Args('input') input: GetServicesByInput) {
    return this.serviceService.getServicesBy(input);
  }

  @Roles(['Admin'])
  @Mutation(() => UpdateServiceOutput)
  updateService(@Args('input') input: UpdateServiceInput) {
    return this.serviceService.updateService(input);
  }

  @Roles(['Admin'])
  @Mutation(() => DeleteServiceOutput)
  deleteService(@Args('input') input: DeleteServiceInput) {
    return this.serviceService.deleteService(input);
  }
}
