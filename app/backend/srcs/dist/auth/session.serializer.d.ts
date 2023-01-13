import { PassportSerializer } from "@nestjs/passport";
import { User } from "src/users/entity/user.entity";
export declare class SessionSerializer extends PassportSerializer {
    constructor();
    serializeUser(user: User, done: (err: Error, user: User) => void): any;
    deserializeUser(payload: User, done: (err: Error, user: User) => void): void;
}
