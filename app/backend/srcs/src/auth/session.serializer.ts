import { Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { User } from "src/users/entity/user.entity"

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor() {
    super();
  }

  serializeUser(user: User, done: (err: Error, user: User) => void): any {
    done(null, user);
  }

  deserializeUser(payload: User, done: (err: Error, user: User) => void) {
    return done(null, payload);
  }
}
