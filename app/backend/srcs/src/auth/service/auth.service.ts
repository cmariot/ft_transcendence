import { Injectable } from "@nestjs/common";
import { UserEntity } from "../../users/entity/user.entity";
import { UsersService } from "src/users/services/users.service";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(user: {
    username: string;
    displayName: string;
    email: string;
  }): Promise<UserEntity> {
    let db_user: UserEntity = await this.usersService.getByUsername(
      user.username
    );
    if (db_user && user.email === db_user.email) {
      return db_user;
    }
    return this.usersService.saveUser(user);
  }

  async login(user: UserEntity) {
    const payload = { username: user.username, sub: user.uuid };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
