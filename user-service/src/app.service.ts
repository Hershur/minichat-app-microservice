import { BadRequestException, Injectable } from '@nestjs/common';
import { SignUpEvent } from './events/signup.event';
import { PrismaService } from 'prisma/prisma.service';
import { SignInEvent } from './events/signin-event';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JWTSecret } from './config';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async handleSignUp(data: SignUpEvent) {
    const { email: userEmail } = data;

    const findUser = await this.prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (findUser) {
      throw new BadRequestException('User already exists');
    }

    const { id, email, name } = await this.prisma.user.create({ data });
    return { id, email, name };
  }

  async handleSignIn(data: SignInEvent) {
    const { email, password } = data;

    const findUser = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true, password: true },
    });

    if (!findUser) {
      throw new BadRequestException('Invalid credentials supplied');
    }

    const { password: userPassword, ...userData } = findUser;
    const isPasswordMatch = await bcrypt.compare(password, userPassword);

    if (!isPasswordMatch) {
      throw new BadRequestException('Invalid credentials supplied');
    }

    return {
      ...userData,
      accessToken: this.jwtService.sign(userData, { secret: JWTSecret }),
    };
  }
}
