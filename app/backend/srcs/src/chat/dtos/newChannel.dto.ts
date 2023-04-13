import {
    IsEmpty,
    IsNotEmpty,
    IsString,
    MinLength,
    Matches,
} from "class-validator";

export class ProtectedChannelDTO {
    @IsNotEmpty()
    @IsString()
    @Matches(/^[a-zA-Z0-9_.!@#$%^&*À-ÿ-]+$/)
    channelName: string;

    @IsNotEmpty()
    @IsString()
    @Matches(/^[a-zA-Z0-9_.!@#$%^&*À-ÿ-]+$/)
    channelType: string;

    @IsString()
    @MinLength(10)
    @Matches(/^[a-zA-Z0-9_.!@#$%^&*À-ÿ-]+$/)
    channelPassword: string;

    @IsEmpty()
    channelOwner: string;
}
export class PrivateChannelDTO {
    @IsNotEmpty()
    @IsString()
    @Matches(/^[a-zA-Z0-9_.!@#$%^&*À-ÿ-]+$/)
    channelName: string;

    @IsNotEmpty()
    @IsString()
    @Matches(/^[a-zA-Z0-9_.!@#$%^&*À-ÿ-]+$/)
    channelType: string;

    @IsString()
    @IsEmpty()
    channelPassword: string;

    @IsEmpty()
    channelOwner: string;
}

export class PrivateMessageDTO {
    @IsNotEmpty()
    @IsString()
    @Matches(/^[a-zA-Z0-9_.!@#$%^&*À-ÿ-]+$/)
    channelName: string;

    @IsNotEmpty()
    @IsString()
    @Matches(/^[a-zA-Z0-9_.!@#$%^&*À-ÿ-]+$/)
    channelType: string;

    @IsEmpty()
    channelOwner: string;
}

export class PublicChannelDTO {
    @IsNotEmpty()
    @IsString()
    @Matches(/^[a-zA-Z0-9_.!@#$%^&*À-ÿ-]+$/)
    channelName: string;

    @IsNotEmpty()
    @IsString()
    @Matches(/^[a-zA-Z0-9_.!@#$%^&*À-ÿ-]+$/)
    channelType: string;

    @IsEmpty()
    channelOwner: string;
}
