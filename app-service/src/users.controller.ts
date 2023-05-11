import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SignUpRequest } from './dtos/singup-request.dto';
import { UsersService } from './services/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly useService: UsersService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async signUp(@Body() signUpRequest: SignUpRequest) {
    const result = await this.useService.signUp(signUpRequest);
    return result;
  }
}
