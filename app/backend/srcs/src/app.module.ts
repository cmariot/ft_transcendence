import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AuthModule } from './auth/auth.module';

@Module({
  controllers: [AppController],
  imports: [AuthModule],
})
export class AppModule {}
