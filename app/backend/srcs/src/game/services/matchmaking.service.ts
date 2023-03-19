import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UsersService } from "src/users/services/users.service";
import { GameEntity } from "../entities/game.entity";
import { InvitationDto, InvitationResponseDto } from "../dtos/GameUtility.dto";
import { UserEntity } from "src/users/entity/user.entity";
import { GameService, games } from "./game.service";
import { GameInterface } from "../interfaces/game.interface";

@Injectable()
export class MatchmakingService {
    constructor(
        @InjectRepository(GameEntity)
        private gameRepository: Repository<GameEntity>,
        private userService: UsersService,
        private gameService: GameService
    ) {}

    async joinQueue(uuid: string) {
        let user: UserEntity = await this.userService.getByID(uuid);
        if (!user) {
            throw new UnauthorizedException("User not found");
        }
        let game: GameEntity = await this.gameRepository.findOneBy({
            hostID: uuid,
        });
        if (!game) {
            game = await this.gameRepository.findOneBy({
                guestID: uuid,
            });
        }
        if (game) {
            if (game.status === "waiting") {
                throw new UnauthorizedException("Already in queue.");
            } else if (game.status === "playing") {
                let foundGame: GameInterface = games.get(game.uuid);
                if (foundGame) {
                    foundGame.disconnection = true;
                    games.set(game.uuid, foundGame);
                    return;
                }
                await this.gameRepository.remove(game);
            }
        }
        game = await this.gameRepository.findOneBy({
            status: "waiting",
        });
        if (!game) {
            game = new GameEntity();
            game.hostID = uuid;
            game.status = "waiting";
            await this.gameRepository.save(game);
            await this.userService.setStatusByID(uuid, "matchmaking");
        } else {
            game.guestID = uuid;
            game.status = "playing";
            await this.gameRepository.save(game);
            this.gameService.startGame(game);
        }
    }

    async cancelQueue(uuid: string) {
        let user: UserEntity = await this.userService.getByID(uuid);
        if (!user) {
            throw new UnauthorizedException("User not found");
        }
        let game: GameEntity = await this.gameRepository.findOneBy({
            hostID: uuid,
        });
        if (game && game.status === "waiting") {
            await this.gameRepository.remove(game);
            await this.userService.setStatusByID(uuid, "online");
            return;
        } else {
            game = await this.gameRepository.findOneBy({
                guestID: uuid,
            });
            if (game && game.status === "waiting") {
                await this.gameRepository.remove(game);
                await this.userService.setStatusByID(uuid, "online");
                return;
            }
        }
        throw new UnauthorizedException("Game not found");
    }

    async userDisconnection(user: UserEntity, recursive: boolean) {
        let game: GameEntity;
        if (recursive === true) {
            game = await this.gameRepository.findOneBy({
                hostID: user.uuid,
            });
        } else {
            game = await this.gameRepository.findOneBy({
                guestID: user.uuid,
            });
        }
        if (game) {
            if (game.status === "waiting") {
                await this.gameRepository.remove(game);
                return;
            } else if (game.status === "playing") {
                let foundGame: GameInterface = games.get(game.uuid);
                if (foundGame) {
                    foundGame.disconnection = true;
                    games.set(game.uuid, foundGame);
                    return;
                }
            }
        }
        if (recursive === true) {
            this.userDisconnection(user, false);
        }
    }

    async invitation(users: InvitationDto) {
        //    let host: UserEntity = await this.userService.getByUsername(users.host);
        //    let guest: UserEntity = await this.userService.getByUsername(
        //        users.guest
        //    );
        //    if (!host) {
        //        throw new HttpException(
        //            "Host do not exist",
        //            HttpStatus.BAD_REQUEST
        //        );
        //    }
        //    if (!guest) {
        //        throw new HttpException(
        //            "Guest do not exist",
        //            HttpStatus.BAD_REQUEST
        //        );
        //    }
        //    let game: GameEntity;
        //    game.hostID = host.uuid;
        //    await this.gameRepository.save(game);
        //    await this.userService.setStatusByID(game.hostID, "matchmaking");
        //    await this.gameGateway.sendInvitation(guest.socketId[0], host.uuid);
        //    return "Invitation pending";
    }

    async ResponseInvitation(users: InvitationResponseDto) {
        //    if (!users.response) {
        //        let host: UserEntity = await this.userService.getByID(users.hostID);
        //        return await this.cancelQueue(host.username);
        //    }
        //    let game: GameEntity = await this.gameRepository.findOneBy({
        //        hostID: users.hostID,
        //    });
        //    if (!game) {
        //        throw new HttpException(
        //            "Host Game do not exist",
        //            HttpStatus.NOT_FOUND
        //        );
        //    }
        //    let guest: UserEntity = await this.userService.getByUsername(
        //        users.guest
        //    );
        //    game.guestID = guest.uuid;
        //    await this.userService.setStatusByID(game.hostID, "matchmaking");
        //    await this.gameRepository.save(game);
        //    this.startGame(game);
        //    return "Game accepted";
    }
}
