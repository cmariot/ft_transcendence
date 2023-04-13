import {
    IsNotEmpty,
    IsString,
    MinLength,
    IsAlphanumeric,
} from "class-validator";

export class LoginDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @IsAlphanumeric()
    username: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(10)
    password: string;
}
