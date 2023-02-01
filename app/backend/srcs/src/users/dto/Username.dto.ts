import { IsNotEmpty, MinLength } from "class-validator";

export class UsernameDto {
  @IsNotEmpty()
  @MinLength(3)
  username: string;
}
