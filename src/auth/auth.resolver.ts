import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import {
  ForgotPasswordInput,
  ForgotPasswordOutput,
  LoginInput,
  LoginOutPut,
  SignUpInput,
  SignUpOutPut,
  VerifyEmailInput,
  VerifyEmailOutput,
  VerifyForgotPasswordInput,
  VerifyForgotPasswordOutput,
} from './dto';
import { NewAccessTokenInput, NewAccessTokenOutput } from './dto/login.dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}
  @Query(() => LoginOutPut)
  login(@Args('input') input: LoginInput) {
    return this.authService.login(input);
  }
  
  @Query(() => NewAccessTokenOutput)
  newAccessToken(@Args('input') input: NewAccessTokenInput) {
    return this.authService.newAccessToken(input);
  }

  @Query(() => VerifyEmailOutput)
  verifyEmail(@Args('input') input: VerifyEmailInput) {
    return this.authService.verifyEmail(input);
  }

  @Mutation(() => SignUpOutPut)
  signup(@Args('input') input: SignUpInput) {
    return this.authService.signUp(input);
  }

  @Query(() => ForgotPasswordOutput)
  forgotPassword(@Args('input') input: ForgotPasswordInput) {
    return this.authService.forgotPassword(input);
  }

  @Mutation(() => VerifyForgotPasswordOutput)
  verifyForgotPassword(@Args('input') input: VerifyForgotPasswordInput) {
    return this.authService.verifyForgotPassword(input);
  }
}
