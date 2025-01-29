import { IsEmail, IsString, MinLength } from "class-validator"

export class AuthDto {
@IsEmail()
    email: string
@MinLength(6, {message: 'password canot then 6 chartes'})
@IsString()
       password:string
}

