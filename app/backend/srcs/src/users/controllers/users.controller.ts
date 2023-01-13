import { Controller, Get, UseGuards } from "@nestjs/common";
import { UsersService } from "../services/users.service";
import { JwtAuthGuard } from "src/auth/guards/jwt_auth.guards";
import { UserEntity } from "../entity/user.entity";

@Controller("users")
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  // JWT protected route
  // curl http://localhost:3000/users -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  @Get()
  @UseGuards(JwtAuthGuard)
  getUsers(): Promise<UserEntity[]> {
    return this.userService.getUsers();
  }
}
