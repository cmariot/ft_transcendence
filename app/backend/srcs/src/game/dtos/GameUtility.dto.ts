import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class UsernameDto {
    @IsNotEmpty()
    @MinLength(3)
    @IsString()
    username: string;
}

export class GameIdDto {
    @IsNotEmpty()
    @MinLength(3)
    @IsString()
    game_id: string;
}
