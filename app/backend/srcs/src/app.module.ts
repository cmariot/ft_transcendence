import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersController } from "./users/users.controller";
import { UsersService } from "./users/users.service";
import { UsersModule } from "./users/users.module";
import { LoginModule } from "./login/login.module";
import { AppGateway } from "./app.gateway";

@Module({
  imports: [
    // Environnment variables
    ConfigModule.forRoot(),

    // Postgres Database
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DATABASE_CONTAINER,
      port: parseInt(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),

    UsersModule,

    LoginModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, AppGateway],
})
export class AppModule {}
