import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UsersService } from './services/users.service';
import { UsersController } from './users.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER:SERVICE',
        transport: Transport.TCP,
      },
    ]),
    PassportModule,
    ConfigModule.forRoot(),
  ],
  controllers: [AppController, UsersController],
  providers: [AppService, UsersService, JwtStrategy],
})
export class AppModule {}
