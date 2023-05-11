import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class SignUpRequest {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(4, 25, { message: 'Password must be between 4 and 25 characters' })
  password: string;

  @IsNotEmpty()
  name: string;
}
