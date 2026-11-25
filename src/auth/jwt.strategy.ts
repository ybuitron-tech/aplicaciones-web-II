import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { jwtOptions } from './auth.config';

interface JwtPayload {
  sub: string | number;
  rol?: string;
  exp: number;
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly usersService: UsersService) {
    const { secret } = jwtOptions();
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
      algorithms: ['HS256'],
    });
  }

  async validate(payload: JwtPayload) {
    if (payload?.sub === undefined || typeof payload.exp !== 'number') {
      throw new UnauthorizedException('Invalid token payload');
    }

    // Tokens emitidos por el login de estudiantes/docentes
    if (payload.rol) {
      return { id: payload.sub, rol: payload.rol };
    }

    // Tokens legacy del login con la tabla User
    if (typeof payload.sub === 'string' && UUID_PATTERN.test(payload.sub)) {
      const user = await this.usersService.findOne(payload.sub);
      if (!user) throw new UnauthorizedException('User no longer exists');
      return user;
    }

    throw new UnauthorizedException('Invalid token payload');
  }
}
