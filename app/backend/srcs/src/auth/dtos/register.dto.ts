import {
    IsBoolean,
    IsEmail,
    IsNotEmpty,
    IsString,
    MinLength,
} from "class-validator";

export class RegisterDto {
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsEmail()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(10)
    password: string;

    @IsBoolean()
    enable2fa: boolean;
}
