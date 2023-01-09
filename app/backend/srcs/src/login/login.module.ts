import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { LocalStrategy } from "./local.strategy";
import { LoginController } from "./login.controller";

@Module({
  controllers: [LoginController],
  providers: [ConfigService, LocalStrategy],
})
export class LoginModule {}
