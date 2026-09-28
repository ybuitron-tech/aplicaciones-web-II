import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module'; // <-- IMPORTANTE
import { JwtStrategy } from './jwt.strategy'; // O la estrategia JWT que tengas definida

@Module({
  imports: [
    UsersModule, // <-- AQUÍ SE IMPORTA USERSMODULE
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKeySuperSegura', // Usa la variable de entorno o un fallback
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}