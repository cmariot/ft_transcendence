import { Module } from "@nestjs/common";
import { UsersService } from "src/users/services/users.service";
import { UsersModule } from "src/users/users.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "src/users/entity/user.entity";
import { GameService } from "./services/game.service";
import { GameController } from "./controllers/game.controller";
import { GameEntity } from "./entities/game.entity";
import { SocketService } from "src/sockets/gateways/socket.gateway";
import { GameGateway } from "../sockets/gateways/gameGateways";
import { UserGateway } from "src/sockets/gateways/user.gateway";

@Module({
    imports: [TypeOrmModule.forFeature([GameEntity, UserEntity])],
    providers: [
        GameService,
        UsersService,
        SocketService,
        GameGateway,
        UserGateway,
    ],
    controllers: [GameController],
})
export class GameModule {}
