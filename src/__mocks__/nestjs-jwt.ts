export class JwtService {
  async signAsync(_payload: any): Promise<string> {
    return 'mock-token';
  }

  sign(_payload: any): string {
    return 'mock-token';
  }

  decode(_token: string): any {
    return { exp: 86400, iat: 0 };
  }
}
