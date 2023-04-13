import { IsNotEmpty, IsNumberString, IsString, Matches } from "class-validator";

export class muteOptionsDTO {
    @IsNotEmpty()
    @IsString()
    @Matches(/^[a-zA-Z0-9_.!@#$%^&*À-ÿ-]+$/)
    channelName: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^[a-zA-Z0-9_.!@#$%^&*À-ÿ-]+$/)
    username: string;

    @IsNumberString()
    @IsNotEmpty()
    duration: number;
}
export class kickOptionsDTO {
    @IsNotEmpty()
    @IsString()
    @Matches(/^[a-zA-Z0-9_.!@#$%^&*À-ÿ-]+$/)
    channelName: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^[a-zA-Z0-9_.!@#$%^&*À-ÿ-]+$/)
    username: string;
}

export class AddOptionsDTO {
    @IsNotEmpty()
    @IsString()
    @Matches(/^[a-zA-Z0-9_.!@#$%^&*À-ÿ-]+$/)
    channelName: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^[a-zA-Z0-9_.!@#$%^&*À-ÿ-]+$/)
    username: string;
}
