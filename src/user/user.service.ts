import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createError } from 'src/common/utils';
import { ILike, Repository } from 'typeorm';
import { UpdateUserInput, UpdateUserOutput } from './dto';
import {
  ChangePasswordInput,
  ChangePasswordOutput,
} from './dto/changePassword.dto';
import { GetUserByInput, GetUserByOutput } from './dto/getUser.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async updateUser(
    currentUser: User,
    input: UpdateUserInput,
  ): Promise<UpdateUserOutput> {
    try {
      const updatedUser = {
        ...currentUser,
        ...input,
      };
      await this.userRepo.save(updatedUser);
      return {
        ok: true,
      };
    } catch (err) {
      return createError('Server', 'Lỗi serer, thử lại sau');
    }
  }

  async changePassword(
    currentUser: User,
    input: ChangePasswordInput,
  ): Promise<ChangePasswordOutput> {
    try {
      const { password, confirmPassword, currentPassword } = input;
      if (password != confirmPassword)
        return createError('Password', 'Mật khẩu xác nhận không khớp!');
      const user = await this.userRepo.findOne({
        where: {
          id: currentUser.id,
        },
        select: ['password'],
      });
      if (!(await user.checkPassword(currentPassword)))
        return createError('Current password', 'Mật khẩu hiện tại không đúng');
      currentUser.password = password;
      await this.userRepo.save(currentUser);
      return {
        ok: true,
      };
    } catch (err) {
      return createError('Server', 'Lỗi serer, thử lại sau');
    }
  }

  async getUserBy({
    pagination: { page, resultsPerPage },
    name,
    phoneNumber,
    role,
  }: GetUserByInput): Promise<GetUserByOutput> {
    try {
      const [users, totalResults] = await this.userRepo.findAndCount({
        where: {
          name: name ? ILike(`%${name}%`) : undefined,
          phoneNumber: phoneNumber ? ILike(`%${phoneNumber}%`) : undefined,
          role: role || undefined,
        },
        skip: (page - 1) * resultsPerPage,
        take: resultsPerPage,
      });
      return {
        ok: true,
        pagination: {
          totalPages: Math.ceil(totalResults / resultsPerPage),
          totalResults,
        },
        users,
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
}
