import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Roles } from 'src/auth/role.decorator';
import { CurrentUser } from 'src/auth/user.decorator';
import {
  ChangePasswordInput,
  ChangePasswordOutput,
  GetDetailUserOutput,
  UpdateUserInput,
  UpdateUserOutput,
} from './dto';
import { GetUserByInput, GetUserByOutput } from './dto/getUser.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Roles(['Any'])
  @Query(() => GetDetailUserOutput)
  getDetailUser(@CurrentUser() user): GetDetailUserOutput {
    return {
      ok: true,
      user,
    };
  }
  @Roles(['Any'])
  @Mutation(() => UpdateUserOutput)
  updateUser(
    @CurrentUser() currentUser,
    @Args('input') input: UpdateUserInput,
  ) {
    return this.userService.updateUser(currentUser, input);
  }

  @Roles(['Any'])
  @Mutation(() => ChangePasswordOutput)
  changePassword(
    @CurrentUser() currentUser,
    @Args('input') input: ChangePasswordInput,
  ) {
    return this.userService.changePassword(currentUser, input);
  }

  @Roles(['Admin'])
  @Query(() => GetUserByOutput)
  getUserBy(@Args('input') input: GetUserByInput) {
    return this.userService.getUserBy(input);
  }
}
