import { Injectable, Redirect } from "@nestjs/common";
import { UserEntity } from "../../users/entity/user.entity";
import { UsersService } from "src/users/services/users.service";
import { Profile } from "passport-42";

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(user: UserEntity): Promise<UserEntity> {
    console.log("validateUser");
    if (this.usersService.findById(user.uuid) != null) {
      return user;
    }
    return this.usersService.saveUser(user);
  }

  login_success(): string {
    return "login success !";
  }
}
