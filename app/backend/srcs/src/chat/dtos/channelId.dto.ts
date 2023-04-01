import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class channelDTO {
    @IsString()
    channelName: string;
}

export class usernameDTO {
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
export class addAdminDTO {
    @IsNotEmpty()
    @IsString()
    channelName: string;

    @IsString()
    @IsNotEmpty()
    newAdminUsername: string;
}
