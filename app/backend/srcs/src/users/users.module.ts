import { Module } from "@nestjs/common";
import { UsersService } from "./services/users.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./entity/user.entity";
import { UsersController } from "./controllers/users.controller";
import { SocketService } from "src/sockets/gateways/socket.gateway";
import { UserGateway } from "src/sockets/gateways/user.gateway";
import { ConnectionGateway } from "src/sockets/gateways/connection.gateway";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    providers: [UsersService, SocketService, UserGateway],
    controllers: [UsersController],
    exports: [UsersService],
})
export class UsersModule {}
