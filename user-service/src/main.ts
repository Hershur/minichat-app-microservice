import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { ExceptionFilter } from './exceptions/exception-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: 'userservice',
      port: 3002,
    },
  });

  app.useGlobalFilters(new ExceptionFilter());

  await app.startAllMicroservices();
  await app.listen(3002);
}
bootstrap();
