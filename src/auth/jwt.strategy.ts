import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { jwtOptions } from './auth.config';

interface JwtPayload {
  sub: string;
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
    if (
      typeof payload.sub !== 'string' ||
      !UUID_PATTERN.test(payload.sub) ||
      typeof payload.exp !== 'number'
    ) {
      throw new UnauthorizedException('Invalid token payload');
    }

    try {
      return await this.usersService.findOne(payload.sub);
    } catch {
      throw new UnauthorizedException('User no longer exists');
    }
  }
}