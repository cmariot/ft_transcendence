import { IsNotEmpty, MinLength, IsAlphanumeric } from "class-validator";

export class UsernameDto {
    @IsNotEmpty()
    @MinLength(3)
    @IsAlphanumeric()
    username: string;
}
