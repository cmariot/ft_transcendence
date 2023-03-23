import { IsBoolean, IsNotEmpty, IsString, MinLength } from "class-validator";

export class UsernameDto {
    @IsNotEmpty()
    @MinLength(3)
    @IsString()
    username: string;
}

export class InvitationDto {
    @IsNotEmpty()
    @MinLength(3)
    @IsString()
    host: string;

    @IsNotEmpty()
    @MinLength(3)
    @IsString()
    guest: string;
}

export class InvitationResponseDto {
    @IsNotEmpty()
    @MinLength(3)
    @IsString()
    hostID: string;

    @IsNotEmpty()
    @MinLength(3)
    @IsString()
    guest: string;

    @IsBoolean()
    response: boolean;
}

export class GameIdDto {
    @IsNotEmpty()
    @MinLength(3)
    @IsString()
    game_id: string;
}
