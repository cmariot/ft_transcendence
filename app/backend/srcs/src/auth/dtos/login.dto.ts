import { IsNotEmpty, IsString, MinLength, Matches } from "class-validator";

export class LoginDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @Matches(/^[a-zA-Z0-9_.!@#$%^&*À-ÿ-]+$/)
    username: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(10)
    password: string;
}
