import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SignUpRequest } from '../dtos/singup-request.dto';
import { SignUpEvent } from '../events/signup.event';
import { firstValueFrom } from 'rxjs';
import * as bcrypt from 'bcrypt';
import { SignInRequest } from 'src/dtos/signin-request.dto';
import { SignInEvent } from 'src/events/signin-event';
import { Request, Response } from 'express';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER:SERVICE') private readonly userServiceClient: ClientProxy,
  ) {}

  async signUp(signUpRequest: SignUpRequest) {
    try {
      const hashedPassword = await bcrypt.hash(signUpRequest.password, 10);
      const result = await firstValueFrom(
        this.userServiceClient.send(
          'user:signup',
          new SignUpEvent(
            signUpRequest.email,
            signUpRequest.name,
            hashedPassword,
          ),
        ),
      );

      return {
        success: true,
        message: 'User created successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        error,
        error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async signIn(
    signInRequest: SignInRequest,
    request: Request,
    response: Response,
  ) {
    try {
      const result = await firstValueFrom(
        this.userServiceClient.send(
          'user:signin',
          new SignInEvent(signInRequest.email, signInRequest.password),
        ),
      );

      const { accessToken, ...data } = result;

      if (!accessToken) {
        throw new HttpException('Invalid request', HttpStatus.FORBIDDEN);
      }

      response.cookie('accessToken', accessToken, {
        httpOnly: true,
        expires: new Date(new Date().getTime() + 180 * 1000), //expires in 3 minutes
      });

      return response.send({
        success: true,
        message: 'User signed in successfully',
        data,
      });
    } catch (error) {
      throw new HttpException(
        error,
        error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
