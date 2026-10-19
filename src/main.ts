import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Permitir la conexión desde tu Frontend Angular
  app.enableCors();

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
  console.log(`Backend listo en http://localhost:${PORT}/api/v1`);
}
bootstrap();