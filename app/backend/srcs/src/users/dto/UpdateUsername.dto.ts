import { IsNotEmpty, MinLength } from "class-validator";

export class UpdateUsernameDto {
  @IsNotEmpty()
  @MinLength(3)
  username: string;
}
