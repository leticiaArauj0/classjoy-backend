/* eslint-disable prettier/prettier */
import { IsJWT, IsStrongPassword } from 'class-validator';

export class AuthResetDTO {
  @IsStrongPassword({
    minLength: 8,
    minUppercase: 0,
    minLowercase: 1,
    minSymbols: 0,
    minNumbers: 1,
  })
  password: string;

   @IsJWT()
   token: string;
}
