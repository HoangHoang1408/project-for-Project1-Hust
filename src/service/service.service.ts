import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isNil, omitBy } from 'lodash';
import { createError } from 'src/common/utils';
import { ILike, Repository } from 'typeorm';
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
} from './dto/service.dto';
import { Service } from './entities/service.entity';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,
  ) {}
  async createService(input: CreateServiceInput): Promise<CreateServiceOutput> {
    try {
      await this.serviceRepo.save(this.serviceRepo.create({ ...input }));
      return {
        ok: true,
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }

  async getServicesBy({
    serviceName,
    pagination: { page, resultsPerPage },
  }: GetServicesByInput): Promise<GetServicesByOutput> {
    try {
      const [services, totalResults] = await this.serviceRepo.findAndCount({
        where: {
          serviceName: serviceName ? ILike(`%${serviceName}%`) : undefined,
        },
        skip: (page - 1) * resultsPerPage,
        take: resultsPerPage,
      });
      return {
        ok: true,
        services,
        pagination: {
          totalPages: Math.ceil(totalResults / resultsPerPage),
          totalResults,
        },
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }

  async getServiceDetail({ id }: GetServiceInput): Promise<GetServiceOutput> {
    try {
      const service = await this.serviceRepo.findOne({ where: { id } });
      if (!service) return createError('input', 'Không tồn tại dịch vụ');
      return {
        ok: true,
        service,
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }

  async updateService({
    id,
    serviceName,
    servicePrice,
    description,
    perDay,
  }: UpdateServiceInput) {
    try {
      let service = await this.serviceRepo.findOne({ where: { id } });
      if (!service) return createError('input', 'Không tồn tại dịch vụ');
      service = {
        ...service,
        ...omitBy(
          {
            serviceName,
            servicePrice,
            description,
            perDay,
          },
          isNil,
        ),
      };
      await this.serviceRepo.save(service);
      return {
        ok: true,
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }

  async deleteService({
    id,
  }: DeleteServiceInput): Promise<DeleteServiceOutput> {
    try {
      const service = await this.serviceRepo.findOne({ where: { id } });
      if (!service) return createError('input', 'Nội dung không tồn tại');
      await this.serviceRepo.remove(service);
      return {
        ok: true,
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
}
