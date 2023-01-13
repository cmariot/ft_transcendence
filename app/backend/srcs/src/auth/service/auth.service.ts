import { Injectable, Redirect } from "@nestjs/common";
import { User } from "../../users/entity/user.entity";
import { UsersService } from "src/users/services/users/users.service";

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  forty_two(): void {
    return;
  }

  @Redirect("/auth/login/success")
  forty_two_redirection(): void {
    return;
  }

  login_success(): string {
    return "login success" + "user infos";
  }

  login_failure(): string {
    return "login failure";
  }

  logout(): string {
    return "logout";
  }

  // Our AuthService has the job of retrieving a user and verifying the password.
  // We create a validateUser() method for this purpose.
  // In the code below, we use a convenient ES6 spread operator to strip the password property from the user object before returning it.
  // We'll be calling into the validateUser() method from our Passport local strategy in a moment.
  async validateUser(user: User, access_token: string): Promise<User> {
    return this.usersService.saveUser(user);
  }
}
