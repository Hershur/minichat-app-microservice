import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MesssageRequest } from './dtos/message-request.dto';
import { Logger, UseFilters, UseGuards } from '@nestjs/common';
import { MessageService } from './services/message.service';
import { WebsocketExceptionsFilter } from './exceptions';
import { WSAuthorizationGuard } from './auth/ws-auth.guard';

@UseGuards(WSAuthorizationGuard)
@UseFilters(new WebsocketExceptionsFilter())
@WebSocketGateway({ namespace: '/message' })
export class MessagesGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('MessagesGateway');
  private readonly users = new Map<string, string>();

  constructor(private readonly messageService: MessageService) {}

  handleConnection(client: Socket) {
    const token = client.handshake.headers.authorization?.split(' ')?.[1];
    const userId = this.messageService.getUserDetailsFromAuthToken(token, 'id');
    this.users.set(userId, client.id);

    this.logger.log(`${client.id} - connected`);
    this.server.emit('all', `${client.id} has joined`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`${client.id} - disconnected`);
  }

  afterInit() {
    this.logger.log('Initialized!');
  }

  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody('data') message: MesssageRequest,
  ) {
    return this.messageService.sendMessage(message, this.server, this.users);
  }
}
