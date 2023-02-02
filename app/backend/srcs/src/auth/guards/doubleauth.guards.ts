import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class DoubleAuthGuard extends AuthGuard("jwt") {
    handleRequest(err, user, info) {
        console.log("DOUBLE AUTH GUARD !!!");
        if (err || !user) {
            console.log("ERROR :ooo");
            throw err || new UnauthorizedException();
        }
        if (user.type === "double_authentification") {
            return user;
        }
        throw new UnauthorizedException();
    }
}
