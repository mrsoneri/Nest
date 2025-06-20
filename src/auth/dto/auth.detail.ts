import { IsEmail, IsEmpty, IsNotEmpty } from 'class-validator';

export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsEmpty()
  firstName: string;

  @IsEmpty()
  lastName: string;
}
