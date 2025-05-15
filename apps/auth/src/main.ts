import { NestFactory } from '@nestjs/core';
import { AuthAPPModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  // const app = await NestFactory.create(AuthAPPModule);
  // await app.listen(process.env.PORT ?? 3001);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AuthAPPModule, {
    transport: Transport.TCP,
    options: { host: '0.0.0.0', port: +process.env.PORT },
  });

  await app.listen();
}
bootstrap();
