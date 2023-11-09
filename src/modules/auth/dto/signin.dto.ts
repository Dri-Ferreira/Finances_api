import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class SigninDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/, {
    message:
      'The password must contain a minimum of 8 characters, including at least one uppercase letter, one lowercase letter, one number and one special character.',
  })
  password: string;
}
