import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @IsNotEmpty()
  @MinLength(3)
  DisplayName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}