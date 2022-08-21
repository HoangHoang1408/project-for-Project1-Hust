import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createError } from 'src/common/utils';
import { Repository } from 'typeorm';
import { UpdateUserInput, UpdateUserOutput } from './dto';
import {
  ChangePasswordInput,
  ChangePasswordOutput,
} from './dto/changePassword.dto';
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
    } catch {
      return createError(
        'Server',
        'Server error, can not update user right now',
      );
    }
  }

  async changePassword(
    currentUser: User,
    input: ChangePasswordInput,
  ): Promise<ChangePasswordOutput> {
    try {
      const { password, confirmPassword, currentPassword } = input;
      if (password != confirmPassword)
        return createError('Password', 'Confirm password does not match!');
      const user = await this.userRepo.findOne({
        where: {
          id: currentUser.id,
        },
        select: ['password'],
      });
      if (!(await user.checkPassword(currentPassword)))
        return createError('Current password', 'Wrong current password');
      currentUser.password = password;
      await this.userRepo.save(currentUser);
      return {
        ok: true,
      };
    } catch (err) {
      return createError(
        'Server',
        "Server error, can not change user's password right now",
      );
    }
  }
}
