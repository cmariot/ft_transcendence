import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, Res } from "@nestjs/common";
import { jwtConstants } from "../constants/jwt.constants";
import { Request as RequestType } from "express";

@Injectable()
export class AuthentificationStrategy extends PassportStrategy(
    Strategy,
    "jwt"
) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                AuthentificationStrategy.extractJWT,
                ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret,
        });
    }

    private static extractJWT(req: RequestType): string | null {
        if (req.cookies) {
            if (req.cookies["authentification"]) {
                return req.cookies["authentification"];
            } else if (req.cookies["email_validation"]) {
                return req.cookies["email_validation"];
            } else if (req.cookies["double_authentification"]) {
                return req.cookies["double_authentification"];
            }
        }
        return null;
    }

    async validate(payload: any) {
        return {
            uuid: payload.uuid,
            email: payload.email,
            type: payload.type,
        };
    }
}
