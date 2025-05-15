import { NestFactory } from '@nestjs/core';
import { EventAPPModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(EventAPPModule);
  await app.listen(process.env.PORT ?? 3002);
}
bootstrap();
