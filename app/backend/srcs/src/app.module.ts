import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { LoginModule } from "./login/login.module";
import { HttpModule } from "@nestjs/axios";
import { AppController } from "./app.controller";

@Module({
  imports: [ConfigModule.forRoot(), HttpModule, LoginModule],
  controllers: [AppController],
})
export class AppModule {}
