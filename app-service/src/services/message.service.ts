import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { WsResponse } from '@nestjs/websockets';
import { firstValueFrom } from 'rxjs';
import { MesssageRequest } from 'src/dtos/message-request.dto';
import { MessageEvent } from 'src/events/message-event';
import { Server } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class MessageService {
  constructor(
    @Inject('MESSAGE:SERVICE')
    private readonly messageServiceClient: ClientProxy,
    private jwtService: JwtService,
  ) {}

  async sendMessage(
    messageRequest: MesssageRequest,
    socket: Server,
    users: Map<string, string>,
  ): Promise<WsResponse<string>> {
    try {
      const connectedUsers = Array.from(users, ([key, value]) => {
        return { id: key, socketId: value };
      });

      const result = await firstValueFrom(
        this.messageServiceClient.send(
          'message:send',
          new MessageEvent(
            messageRequest.messageId,
            messageRequest.senderUserId,
            messageRequest.receiverUserId,
            messageRequest.messageBody,
            connectedUsers,
          ),
        ),
      );

      const messageId = Date.now().toString();

      const message = {
        messageId,
        body: result.message,
      };

      const isMessageSent = socket
        .to(result.receiverSocketId)
        .emit('message', message);

      if (isMessageSent) {
        return {
          event: 'message',
          data: `Message ${messageId}, sent`,
        };
      }
    } catch (error) {
      throw new HttpException(
        error,
        error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  getUserDetailsFromAuthToken(token: string, key: string): string {
    const payload = this.jwtService.decode(token);
    return payload[key];
  }
}
