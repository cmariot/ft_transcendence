import { Injectable } from "@nestjs/common";
import { UserDto } from "src/users/dto/user.dto";
import { UsersService } from "src/users/services/users/users.service";

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  login_success(): string {
    return "login success + user informations";
  }

  login_failure(): string {
    return "login failure";
  }

  logout(): string {
    return "logout";
  }

  forty_two(): string {
    return "authenticate via passport-42";
  }

  forty_two_redirection(): string {
    return "redirect to home page if login succeeded or redirect to /auth/login/failed if failed";
  }

  // Our AuthService has the job of retrieving a user and verifying the password.
  // We create a validateUser() method for this purpose.
  // In the code below, we use a convenient ES6 spread operator to strip the password property from the user object before returning it.
  // We'll be calling into the validateUser() method from our Passport local strategy in a moment.
  async validateUser(user: UserDto, access_token: string) {
    const updated_user = await this.usersService.createUser(user);
    if (updated_user && access_token) {
      console.log(access_token);
      return updated_user;
    }
    return null;
  }
}
