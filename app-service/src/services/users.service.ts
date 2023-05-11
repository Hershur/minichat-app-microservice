import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SignUpRequest } from '../dtos/singup-request.dto';
import { SignUpEvent } from '../events/signup.event';
import { firstValueFrom } from 'rxjs';
import * as bcrypt from 'bcrypt';

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
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'An unknown error occurred',
          error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
