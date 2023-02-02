import { IsNumberString, Length, MaxLength, MinLength } from "class-validator";

export class emailValidationCodeDto {
    @IsNumberString()
    @MinLength(6)
    @MaxLength(6)
    @Length(6)
    code: string;
}
