import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { jsonResponse } from 'src/common/utils/response.util';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Post('signup')
  // signup(@Body() dto: AuthDto) {
  //   return this.authService.signup(dto); // Pass dto to the service if needed
  // }

  // @HttpCode(HttpStatus.OK)
  // @Post('signin')
  // signin(@Body() dto: AuthDto) {
  //   return this.authService.signin(dto);
  // }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  public async login(@Body() loginUserDto: LoginUserDto) {
    const email = loginUserDto.email.toLowerCase();
    const portalId = loginUserDto.portalId;
    const IsAuthenticatedPortal = await this.authService.validateUserPortal(
      email,
      portalId,
    );

    if (!IsAuthenticatedPortal) {
      return jsonResponse(
        HttpStatus.UNAUTHORIZED,
        false,
        'Invalid combination of email and portalId',
      );
    }

    const credentials = {
      email: loginUserDto.email,
      password: loginUserDto.password,
      portalId: loginUserDto.portalId,
    };

    const user = await this.authService.login(credentials);

    if (!user) {
      return jsonResponse(
        HttpStatus.UNAUTHORIZED,
        false,
        'login failed!',
        null,
      );
    }

    return [
      HttpStatus.OK,
      true,
      'You have successfully logged in.',
      {
        token: user.token,
      },
    ];
  }
}
