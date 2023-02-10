import { IsNotEmpty, IsString } from "class-validator";

export class channelDTO {
    @IsNotEmpty()
    @IsString()
    channelName: string;
}

export class messageDTO {
    @IsNotEmpty()
    @IsString()
    channelName: string;

    @IsNotEmpty()
    @IsString()
    message: string;
}
