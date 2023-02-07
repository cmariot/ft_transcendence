import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class isLogged extends AuthGuard("jwt") {
    handleRequest(err, user, info) {
        if (err || !user) {
            throw err || new UnauthorizedException();
        }
        if (user.type === "authentification") {
            // emit connexion to socket here ?
            return user;
        }
        return user;
    }
}
