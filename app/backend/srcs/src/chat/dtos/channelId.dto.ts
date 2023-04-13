import {
    IsBoolean,
    IsNotEmpty,
    IsString,
    IsAlphanumeric,
} from "class-validator";

export class channelDTO {
    @IsString()
    @IsAlphanumeric()
    channelName: string;
}

export class usernameDTO {
    @IsString()
    @IsNotEmpty()
    @IsAlphanumeric()
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
    @IsAlphanumeric()
    channelName: string;

    @IsNotEmpty()
    @IsString()
    @IsAlphanumeric()
    channelPassword: string;
}

export class updateChannelDTO {
    @IsNotEmpty()
    @IsString()
    @IsAlphanumeric()
    channelName: string;

    @IsNotEmpty()
    @IsString()
    @IsAlphanumeric()
    channelType: string;

    @IsNotEmpty()
    @IsBoolean()
    newChannelType: boolean;

    @IsString()
    @IsAlphanumeric()
    newChannelPassword: string;
}
export class addAdminDTO {
    @IsNotEmpty()
    @IsString()
    @IsAlphanumeric()
    channelName: string;

    @IsString()
    @IsNotEmpty()
    @IsAlphanumeric()
    newAdminUsername: string;
}
