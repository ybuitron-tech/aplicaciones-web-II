import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { EstudiantesModule } from './estudiantes/estudiantes.module';
import { ProfesoresModule } from './profesores/profesores.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EscalasModule } from './escalas/escalas.module';
import { EvaluacionesModule } from './evaluaciones/evaluaciones.module';
import { PreguntasModule } from './preguntas/preguntas.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    EstudiantesModule,
    ProfesoresModule,
    EscalasModule,
    EvaluacionesModule,
    PreguntasModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}