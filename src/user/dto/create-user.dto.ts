/* eslint-disable prettier/prettier */
import { IsEmail, IsEnum, IsString, IsStrongPassword } from 'class-validator';
import { Role } from 'src/enums/role.enum';

export class CreateUserDTO {
  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsEmail()
  email: string;

  @IsStrongPassword({
    minLength: 8,
    minUppercase: 0,
    minLowercase: 1,
    minSymbols: 0,
    minNumbers: 1,
  })
  password: string;

  @IsEnum(Role)
  role: string;
}
