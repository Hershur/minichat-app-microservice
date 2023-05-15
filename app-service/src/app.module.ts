import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UsersService } from './services/users.service';
import { UsersController } from './users.controller';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { MessagesGateway } from './messages.gateway';
import { MessageService } from './services/message.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER:SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'userservice',
          port: 3002,
        },
      },
      {
        name: 'MESSAGE:SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'messageservice',
          port: 3001,
        },
      },
    ]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
    PassportModule,
    ConfigModule.forRoot(),
  ],
  controllers: [AppController, UsersController],
  providers: [AppService, UsersService, MessagesGateway, MessageService],
})
export class AppModule {}
