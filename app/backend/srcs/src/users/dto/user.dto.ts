import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class UserDto {
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @IsNotEmpty()
  @MinLength(3)
  displayName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
