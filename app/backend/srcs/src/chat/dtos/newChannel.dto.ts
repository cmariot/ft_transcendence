import { IsEmpty, IsNotEmpty, IsString, MinLength } from "class-validator";

export class NewChannelDTO {
    @IsNotEmpty()
    @IsString()
    channelName: string;

    @IsEmpty()
    channelOwner: string;
}
