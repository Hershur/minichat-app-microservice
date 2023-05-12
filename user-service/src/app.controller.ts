import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern } from '@nestjs/microservices';
import { SignUpEvent } from './events/signup.event';
import { SignInEvent } from './events/signin-event';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @EventPattern('user:signup')
  handleSignUp(data: SignUpEvent) {
    return this.appService.handleSignUp(data);
  }

  @EventPattern('user:signin')
  handleSignIn(data: SignInEvent) {
    return this.appService.handleSignIn(data);
  }
}
