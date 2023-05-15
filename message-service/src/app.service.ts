import { Injectable } from '@nestjs/common';
import { MessageEvent } from './events/message-event';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  handleSendMessage(data: MessageEvent) {
    const user = data.users.find((user) => user.id === data.receiverUserId);

    if (user) {
      return {
        message: data.messageBody,
        receiverSocketId: user.socketId,
      };
    } else {
      return {
        message: 'User is not connected',
      };
    }
  }
}
