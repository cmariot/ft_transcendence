import { IsBoolean, IsNotEmpty, MinLength } from "class-validator";

export class UsernameDto {
    @IsNotEmpty()
    @MinLength(3)
    username: string;
}

export class InvitationDto {
    @IsNotEmpty()
    @MinLength(3)
    host: string;

    @IsNotEmpty()
    @MinLength(3)
    guest: string;
}

export class InvitationResponseDto {
    @IsNotEmpty()
    @MinLength(3)
    hostID: string;

    @IsNotEmpty()
    @MinLength(3)
    guest: string;

    @IsBoolean()
    response: boolean;
}
