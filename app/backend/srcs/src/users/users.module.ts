import { Module } from "@nestjs/common";
import { UsersService } from "./services/users.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./entity/user.entity";
import { FriendshipEntity } from "./entity/friendship.entity";
import { UsersController } from "./controllers/users.controller";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity, FriendshipEntity])],
    providers: [UsersService],
    controllers: [UsersController],
    exports: [UsersService],
})
export class UsersModule {}
