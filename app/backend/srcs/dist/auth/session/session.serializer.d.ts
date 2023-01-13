import { PassportSerializer } from "@nestjs/passport";
import { UserEntity } from "src/users/entity/user.entity";
export declare class SessionSerializer extends PassportSerializer {
    constructor();
    serializeUser(user: UserEntity, done: (err: Error, user: UserEntity) => void): any;
    deserializeUser(payload: UserEntity, done: (err: Error, user: UserEntity) => void): void;
}
