import { Controller, Get } from "@nestjs/common";
import { UsersService } from "src/users/services/users/users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  getUsers() {
    return this.userService.getUsers();
  }
}
