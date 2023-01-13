import { AuthController } from "./controller/auth.controller";
import { AuthService } from "./service/auth.service";
import { FortyTwoStrategy } from "./strategies/forty_two.strategy";
import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "src/users/entity/user.entity";
import { UsersService } from "src/users/services/users.service";

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([UserEntity]),
  ],
  providers: [
    AuthService,
    FortyTwoStrategy,
    UsersService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
