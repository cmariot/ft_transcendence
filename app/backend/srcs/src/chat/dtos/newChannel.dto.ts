import { IsEmpty, IsNotEmpty, IsString, MinLength } from "class-validator";

export class ProtectedChannelDTO {
  @IsNotEmpty()
  @IsString()
  channelName: string;

  @IsNotEmpty()
  @IsString()
  channelType: string;

  @IsString()
  @MinLength(10)
  channelPassword: string;

  @IsEmpty()
  channelOwner: string;
}
export class PrivateChannelDTO {
  @IsNotEmpty()
  @IsString()
  channelName: string;

  @IsNotEmpty()
  @IsString()
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
  channelName: string;

  @IsNotEmpty()
  @IsString()
  channelType: string;

  @IsEmpty()
  channelOwner: string;
}
