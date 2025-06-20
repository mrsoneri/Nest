import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthRepository } from './auth.repository';
import * as moment from 'moment';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { jsonResponse } from 'src/common/utils/response.util';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '60m',
      secret: this.config.get('JWT_SECRET'),
    });
    return {
      access_token: token,
    };
  }

  public async validateUserPortal(email: string, portalId: number) {
    const user = await this.prisma.user.findFirst({
      where: { email, portalId },
      select: {
        portalId: true,
        isActive: true,
        mustChangePassword: true,
        deletedAt: true,
      },
    });

    if (user) {
      return true;
    }

    return false;
  }

  public async login(
    loginUserDto: LoginUserDto,
  ): Promise<User & { token?: string }> {
    const user = await this.authRepository.findByCredentials(loginUserDto);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.deletedAt) {
      jsonResponse(
        HttpStatus.UNPROCESSABLE_ENTITY,
        false,
        'User account deleted',
        null,
      );
    }

    if (user.isActive === false && user.mustChangePassword === true) {
      user.mustChangePassword = true;
      return { ...user, token: this.generateToken(user) };
    }

    if (user.isActive === false && user.mustChangePassword === false) {
      jsonResponse(
        HttpStatus.UNPROCESSABLE_ENTITY,
        false,
        'user_account_inactive_change_default_password',
        null,
      );
    }

    user.lastLoginAt = moment().toDate();
    await this.authRepository.updateLastLogin(user.id);

    const token = this.authRepository.createToken(user);
    return { ...user, token };
  }

  private generateToken(user: User) {
    return this.jwt.sign(
      { id: user.id, email: user.email },
      { secret: this.config.get('JWT_SECRET') },
    );
  }
}
