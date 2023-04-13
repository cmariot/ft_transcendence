import {
    IsBoolean,
    IsEmail,
    IsNotEmpty,
    IsString,
    MinLength,
    IsAlphanumeric,
} from "class-validator";

export class RegisterDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @IsAlphanumeric()
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
