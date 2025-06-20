import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Assuming you're using Prisma
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class AuthRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async findByCredentials(credentials: LoginUserDto) {
    return this.prisma.user.findFirst({
      where: { email: credentials.email, portalId: credentials.portalId },
    });
  }

  async updateLastLogin(userId: number) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { lastLoginAt: new Date() },
    });
  }

  createToken(user: User): string {
    const accessToken: string = this.jwt.sign(user, {
      secret: process.env.JWT_SECRET,
    });
    return accessToken;
  }
}
