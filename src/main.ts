import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { getFrontendOrigins } from './config/env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  // Origen(es) permitidos. En producción es obligatorio definir FRONTEND_ORIGIN.
  app.enableCors({
    origin: getFrontendOrigins(),
    credentials: true,
  });

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
  console.log(`Backend listo en http://localhost:${PORT}/api/v1`);
}
bootstrap();
