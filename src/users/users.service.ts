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
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async create(data: { username: string; passwordHash: string; role: 'ADMINISTRATOR' | 'EVALUATOR' }) {
    return this.prisma.user.create({
      data,
    });
  }
}