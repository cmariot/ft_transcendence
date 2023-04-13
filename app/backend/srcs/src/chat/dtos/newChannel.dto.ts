import {
    IsAlphanumeric,
    IsEmpty,
    IsNotEmpty,
    IsString,
    MinLength,
} from "class-validator";

export class ProtectedChannelDTO {
    @IsNotEmpty()
    @IsString()
    @IsAlphanumeric()
    channelName: string;

    @IsNotEmpty()
    @IsString()
    @IsAlphanumeric()
    channelType: string;

    @IsString()
    @MinLength(10)
    @IsAlphanumeric()
    channelPassword: string;

    @IsEmpty()
    channelOwner: string;
}
export class PrivateChannelDTO {
    @IsNotEmpty()
    @IsString()
    @IsAlphanumeric()
    channelName: string;

    @IsNotEmpty()
    @IsString()
    @IsAlphanumeric()
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
    @IsAlphanumeric()
    channelName: string;

    @IsNotEmpty()
    @IsString()
    channelType: string;

    @IsEmpty()
    channelOwner: string;
}

export class PublicChannelDTO {
    @IsNotEmpty()
    @IsString()
    @IsAlphanumeric()
    channelName: string;

    @IsNotEmpty()
    @IsString()
    @IsAlphanumeric()
    channelType: string;

    @IsEmpty()
    channelOwner: string;
}
