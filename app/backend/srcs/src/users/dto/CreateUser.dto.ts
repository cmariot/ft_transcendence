import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class CreateUserDto {
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