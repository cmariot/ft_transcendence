import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsPositive,
  IsString,
} from "class-validator";

export class muteOptionsDTO {
  @IsNotEmpty()
  @IsString()
  channelName: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsNumberString()
  @IsNotEmpty()
  duration: number;
}
export class kickOptionsDTO {
  @IsNotEmpty()
  @IsString()
  channelName: string;

  @IsString()
  @IsNotEmpty()
  username: string;
}

export class AddOptionsDTO {
  @IsNotEmpty()
  @IsString()
  channelName: string;

  @IsString()
  @IsNotEmpty()
  username: string;
}
