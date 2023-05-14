import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessageEvent } from './events/message-event';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @EventPattern('message:send')
  handleSendMessage(data: MessageEvent) {
    return this.appService.handleSendMessage(data);
  }
}
