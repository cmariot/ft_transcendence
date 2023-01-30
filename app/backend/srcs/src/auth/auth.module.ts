import { AuthController } from "./controllers/auth42.controller";
import { AuthService } from "./services/auth.service";
import { FortyTwoStrategy } from "./strategies/forty_two.strategy";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "src/users/entity/user.entity";
import { UsersModule } from "src/users/users.module";
import { jwtConstants } from "./constants/jwt.constants";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { RegisterController } from "./controllers/register.controller";
import { LogoutController } from "./controllers/logout.controller";
import { LoginController } from "./controllers/login.controller";

@Module({
    imports: [
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: "1h" },
        }),
        PassportModule.register({
            session: false,
        }),
        TypeOrmModule.forFeature([UserEntity]),
        UsersModule,
    ],
    providers: [AuthService, FortyTwoStrategy, JwtStrategy],
    controllers: [
        AuthController,
        LoginController,
        LogoutController,
        RegisterController,
    ],
})
export class AuthModule {}
