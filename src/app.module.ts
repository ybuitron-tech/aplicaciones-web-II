import { Module } from '@nestjs/common';
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
  providers: [AppService],
})
export class AppModule {}