import {
    IsBoolean,
    IsNotEmpty,
    IsString,
    MinLength,
    IsAlphanumeric,
} from "class-validator";

export class UsernameDto {
    @IsNotEmpty()
    @MinLength(3)
    @IsAlphanumeric()
    @IsString()
    username: string;
}

export class GameIdDto {
    @IsNotEmpty()
    @MinLength(3)
    @IsString()
    game_id: string;
}
export class gameOptionsDTO {
    @IsNotEmpty()
    @IsBoolean()
    power_up: boolean;

    @IsNotEmpty()
    @IsBoolean()
    solo: boolean;
}
