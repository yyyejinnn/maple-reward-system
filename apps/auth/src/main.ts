import { NestFactory } from '@nestjs/core';
import { AuthAPPModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthAPPModule);
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
