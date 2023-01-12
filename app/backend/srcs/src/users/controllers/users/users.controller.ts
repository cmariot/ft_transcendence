import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { UserDto } from "src/users/dto/user.dto";
import { UsersService } from "src/users/services/users/users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  @Post("create")
  @UsePipes(ValidationPipe)
  createUsers(@Body() UserDto: UserDto) {
    return this.userService.createUser(UserDto);
  }
}
