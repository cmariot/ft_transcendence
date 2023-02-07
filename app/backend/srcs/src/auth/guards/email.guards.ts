import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class EmailGuard extends AuthGuard("jwt") {
    handleRequest(err, user, info) {
        if (err || !user) {
            throw err || new UnauthorizedException();
        }
        if (user.type === "email_validation") {
            return user;
        }
        return user;
    }
}
