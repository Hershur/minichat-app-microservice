import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SignUpRequest } from './dtos/singup-request.dto';
import { UsersService } from './services/users.service';
import { SignInRequest } from './dtos/signin-request.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly useService: UsersService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async signUp(@Body() signUpRequest: SignUpRequest) {
    return this.useService.signUp(signUpRequest);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signIn(@Body() signInRequest: SignInRequest) {
    return this.useService.signIn(signInRequest);
  }
}
