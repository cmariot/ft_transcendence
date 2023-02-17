import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class channelDTO {
    @IsNotEmpty()
    @IsString()
    channelName: string;
}

export class conversationDTO {
    @IsString()
    @IsNotEmpty()
    username: string;
}

export class messageDTO {
    @IsNotEmpty()
    @IsString()
    channelName: string;

    @IsNotEmpty()
    @IsString()
    message: string;
}

export class channelPasswordDTO {
    @IsNotEmpty()
    @IsString()
    channelName: string;

    @IsNotEmpty()
    @IsString()
    channelPassword: string;
}

export class updateChannelDTO {
    @IsNotEmpty()
    @IsString()
    channelName: string;

    @IsNotEmpty()
    @IsString()
    channelType: string;

    @IsNotEmpty()
    @IsBoolean()
    newChannelType: boolean;

    @IsString()
    newChannelPassword: string;
}
