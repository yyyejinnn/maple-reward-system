import { NestFactory } from '@nestjs/core';
import { EventAPPModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  // const app = await NestFactory.create(EventAPPModule);
  // await app.listen(process.env.PORT ?? 3002);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(EventAPPModule, {
    transport: Transport.TCP,
    options: { host: '0.0.0.0', port: +process.env.PORT },
  });

  await app.listen();
}
bootstrap();
