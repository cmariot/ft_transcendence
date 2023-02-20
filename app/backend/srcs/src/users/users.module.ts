import { Module } from "@nestjs/common";
import { UsersService } from "./services/users.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./entity/user.entity";
import { UsersController } from "./controllers/users.controller";
import { ChatModule } from "src/chat/chat.module";
import { ChatGateway } from "src/chat/gateways/ChatGateway";
import { SocketService } from "src/chat/services/socket.service";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    providers: [UsersService, SocketService],
    controllers: [UsersController],
    exports: [UsersService],
})
export class UsersModule {}
