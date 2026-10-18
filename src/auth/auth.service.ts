import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { verifyPassword } from './password';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async login(username: string, pass: string) {
    const user = await this.usersService.findCredentialsByUsername(username);
    const dummyHash = 'scrypt$16384$8$1$dummysalt$dummykey';
    const valid = await verifyPassword(pass, user ? user.passwordHash : dummyHash);
    
    if (!user || !valid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const access_token = await this.jwtService.signAsync({ sub: user.id });
    const payload = this.jwtService.decode<{ exp: number; iat: number }>(access_token);
    
    return { 
      access_token, 
      token_type: 'Bearer' as const, 
      expires_in: payload.exp - payload.iat 
    };
  }
}