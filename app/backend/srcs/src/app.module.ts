import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { LoginModule } from "./login/login.module";
import { HttpModule } from "@nestjs/axios";
import { AppController } from "./app.controller";
import { UsersModule } from './users/users.module';

@Module({
  imports: [ConfigModule.forRoot(), HttpModule, LoginModule, UsersModule],
  controllers: [AppController],
})
export class AppModule {}
