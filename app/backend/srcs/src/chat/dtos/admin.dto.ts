import {
    IsNotEmpty,
    IsNumber,
    IsNumberString,
    IsPositive,
    IsString,
    IsAlphanumeric,
} from "class-validator";

export class muteOptionsDTO {
    @IsNotEmpty()
    @IsString()
    @IsAlphanumeric()
    channelName: string;

    @IsString()
    @IsNotEmpty()
    @IsAlphanumeric()
    username: string;

    @IsNumberString()
    @IsNotEmpty()
    duration: number;
}
export class kickOptionsDTO {
    @IsNotEmpty()
    @IsString()
    @IsAlphanumeric()
    channelName: string;

    @IsString()
    @IsNotEmpty()
    @IsAlphanumeric()
    username: string;
}

export class AddOptionsDTO {
    @IsNotEmpty()
    @IsString()
    @IsAlphanumeric()
    channelName: string;

    @IsString()
    @IsNotEmpty()
    @IsAlphanumeric()
    username: string;
}
