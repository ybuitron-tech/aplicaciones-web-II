import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findCredentialsByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    return user ? this.sinPasswordHash(user) : null;
  }

  async create(data: { username: string; passwordHash: string; role: 'ADMINISTRATOR' | 'EVALUATOR' }) {
    const user = await this.prisma.user.create({
      data,
    });
    return this.sinPasswordHash(user);
  }

  private sinPasswordHash(user: any) {
    const { passwordHash, ...seguro } = user;
    return seguro;
  }
}