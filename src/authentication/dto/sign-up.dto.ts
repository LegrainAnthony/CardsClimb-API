import {
  IsEmail,
  IsNotEmpty,
  IsString,
  // IsStrongPassword,
} from 'class-validator';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  // @IsStrongPassword({
  //   minLength: 12,
  // })
  password!: string;
}
