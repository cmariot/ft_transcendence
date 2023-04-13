import { IsBoolean, IsNotEmpty, IsString, Matches } from "class-validator";

export class channelDTO {
    @IsString()
    @Matches(/^[a-zA-Z0-9_.!@#$%^&*À-ÿ-]+$/)
    channelName: string;
}

export class usernameDTO {
    @IsString()
    @IsNotEmpty()
    @Matches(/^[a-zA-Z0-9_.!@#$%^&*À-ÿ-]+$/)
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
    @Matches(/^[a-zA-Z0-9_.!@#$%^&*À-ÿ-]+$/)
    channelName: string;

    @IsNotEmpty()
    @IsString()
    @Matches(/^[a-zA-Z0-9_.!@#$%^&*À-ÿ-]+$/)
    channelPassword: string;
}

export class updateChannelDTO {
    @IsNotEmpty()
    @IsString()
    @Matches(/^[a-zA-Z0-9_.!@#$%^&*À-ÿ-]+$/)
    channelName: string;

    @IsNotEmpty()
    @IsString()
    @Matches(/^[a-zA-Z0-9_.!@#$%^&*À-ÿ-]+$/)
    channelType: string;

    @IsNotEmpty()
    @IsBoolean()
    newChannelType: boolean;

    @IsString()
    @Matches(/^[a-zA-Z0-9_.!@#$%^&*À-ÿ-]+$/)
    newChannelPassword: string;
}
export class addAdminDTO {
    @IsNotEmpty()
    @IsString()
    @Matches(/^[a-zA-Z0-9_.!@#$%^&*À-ÿ-]+$/)
    channelName: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^[a-zA-Z0-9_.!@#$%^&*À-ÿ-]+$/)
    newAdminUsername: string;
}
