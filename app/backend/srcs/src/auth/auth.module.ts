import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { UsersModule } from "src/users/users.module";
import { AuthController } from "./controller/auth.controller";
import { AuthService } from "./service/auth.service";
import { FortyTwoStrategy } from "./strategies/forty_two.strategy";
import { SessionSerializer } from "./session.serializer";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "src/users/services/users/users.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/users/entity/user.entity";

@Module({
  imports: [UsersModule, PassportModule, TypeOrmModule.forFeature([User])],
  providers: [
    AuthService,
    ConfigService,
    FortyTwoStrategy,
    UsersService,
    SessionSerializer,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
