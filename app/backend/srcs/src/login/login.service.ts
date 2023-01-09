import { Injectable, Redirect } from "@nestjs/common";
import passport from "passport";
import { Users } from "src/users/users.entity";
import { UsersService } from "src/users/users.service";

@Injectable()
export class LoginService {
  constructor(private usersService: UsersService) {}

  async validateUser(token: string): Promise<any> {
    console.log("test 1");
    return { token: token };
  }
}
