import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class DoubleAuthGuard extends AuthGuard("jwt") {
    handleRequest(err, user, info) {
        if (err || !user) {
            throw err || new UnauthorizedException();
        }
        if (user.type === "double_authentification") {
            return user;
        }
        return user;
    }
}
