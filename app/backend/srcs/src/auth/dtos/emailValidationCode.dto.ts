import { IsNumberString } from "class-validator";

export class emailValidationCodeDto {
    @IsNumberString()
    code: string;
}
