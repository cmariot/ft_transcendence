import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class NewChannelDTO {
    @IsNotEmpty()
    @IsString()
    channel_name: string;
}
