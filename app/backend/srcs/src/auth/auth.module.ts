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
import { RegisterController } from "./controllers/register.controller";
import { LogoutController } from "./controllers/logout.controller";
import { LoginController } from "./controllers/login.controller";
import { AuthentificationStrategy } from "./strategies/authentification.strategy";
import { DoubleAuthController } from "./controllers/doubleAuth.controller";
import { SocketModule } from "src/sockets/socket.module";

@Module({
    imports: [
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: "2h" },
        }),
        PassportModule.register({
            session: false,
        }),
        TypeOrmModule.forFeature([UserEntity]),
        UsersModule,
        SocketModule,
    ],
    providers: [AuthService, FortyTwoStrategy, AuthentificationStrategy],
    controllers: [
        AuthController,
        DoubleAuthController,
        LoginController,
        LogoutController,
        RegisterController,
    ],
})
export class AuthModule {}
