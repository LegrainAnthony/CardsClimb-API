import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // app.useGlobalGuards(new AuthGuard(new Reflector(), new JwtService()));

  const defaultPort = 8080;
  await app.listen(process.env.PORT || defaultPort);
}
void bootstrap();
