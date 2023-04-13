import {
    IsAlphanumeric,
    IsEmpty,
    IsNotEmpty,
    IsString,
    MinLength,
    isAlphanumeric,
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
    @IsAlphanumeric()
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
    @IsAlphanumeric()
    channelPassword: string;

    @IsEmpty()
    @IsAlphanumeric()
    channelOwner: string;
}

export class PrivateMessageDTO {
    @IsNotEmpty()
    @IsString()
    @IsAlphanumeric()
    channelName: string;

    @IsNotEmpty()
    @IsString()
    @IsAlphanumeric()
    channelType: string;

    @IsEmpty()
    @IsAlphanumeric()
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
    @IsAlphanumeric()
    channelOwner: string;
}
