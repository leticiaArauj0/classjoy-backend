/* eslint-disable prettier/prettier */
import { IsEmail, IsStrongPassword } from 'class-validator';

export class AuthLoginDTO {
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
}
