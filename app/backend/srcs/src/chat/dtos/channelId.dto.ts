import { IsNotEmpty, IsString } from "class-validator";

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
