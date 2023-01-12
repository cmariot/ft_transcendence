import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthService {
  constructor() {}

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
}
