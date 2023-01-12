import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { UsersModule } from "src/users/users.module";
import { AuthController } from "./controller/auth.controller";
import { AuthService } from "./service/auth.service";
import { FortyTwoStrategy } from "./strategies/forty_two.strategy";

@Module({
  imports: [UsersModule, PassportModule],
  controllers: [AuthController],
  providers: [AuthService, FortyTwoStrategy, ConfigService],
})
export class AuthModule {}
