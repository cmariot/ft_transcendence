import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
@Injectable()
export class isLogged extends AuthGuard("jwt") {
    handleRequest(err, user, info) {
        if (err || !user) {
            throw err || new UnauthorizedException();
        }
        if (user.type === "authentification") {
<<<<<<< HEAD
			return user;
=======
            return user;
>>>>>>> 68f5bd4c548d3da9f3202504c8f62258c7331607
        }
        return user;
    }
}
