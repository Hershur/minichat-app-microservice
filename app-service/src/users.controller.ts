import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { SignUpRequest } from './dtos/singup-request.dto';
import { UsersService } from './services/users.service';
import { SignInRequest } from './dtos/signin-request.dto';
import { Request, Response } from 'express';
@Controller('users')
export class UsersController {
  constructor(private readonly useService: UsersService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async signUp(@Body() signUpRequest: SignUpRequest) {
    const result = await this.useService.signUp(signUpRequest);
    return result;
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signIn(
    @Body() signInRequest: SignInRequest,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.useService.signIn(
      signInRequest,
      request,
      response,
    );
    return result;
  }
}
