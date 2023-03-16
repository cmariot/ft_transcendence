import { Module } from "@nestjs/common";
import { UsersService } from "./services/users.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./entity/user.entity";
import { UsersController } from "./controllers/users.controller";
import { UserGateway } from "src/sockets/gateways/user.gateway";
import { StatusGateway } from "src/sockets/gateways/status.gateway";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    providers: [UsersService, UserGateway],
    controllers: [UsersController],
    exports: [UsersService],
})
export class UsersModule {}
