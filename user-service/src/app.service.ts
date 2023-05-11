import { Injectable } from '@nestjs/common';
import { SignUpEvent } from './events/signup.event';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async handleSignUp(data: SignUpEvent) {
    const { email } = data;

    const findUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (findUser) {
      throw new Error(`User ${findUser.email} already exists`);
    }

    const user = this.prisma.user.create({ data });
    return user;
  }
}
