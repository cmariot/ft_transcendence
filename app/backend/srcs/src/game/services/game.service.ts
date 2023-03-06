import {
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UsersService } from "src/users/services/users.service";
import { GameEntity } from "../entities/game.entity";
import { UsernameDto } from "../dtos/GameUtility.dto";
import { GameGateway } from "../gateways/GameGateways";

@Injectable()
export class GameService {
    constructor(
        @InjectRepository(GameEntity)
        private gameRepository: Repository<GameEntity>,
        private userService: UsersService,
        private GameGateway: GameGateway
    ) {}

    async joinQueue(user: UsernameDto) {
        //regarde si il y a des joueurs en attente
        let game: GameEntity = await this.gameRepository.findOneBy({
            status: "waiting",
        });
        if (game) {
            //ajoute le joueur dans la gameEntity si il en trouv un en train d'attendre
            game.players.right = user.username;
            game.status = "playing";
            this.gameRepository.save(game);
            //startGame() function qui va lancer la game en envoyant des sockets de confirmation aux 2 joueurs
            return "You found a match";
        } else if (!game) {
            //creer une game entity qui va attendre un joueur
            game = new GameEntity();
            game.players = { left: user.username, right: "" };
            game.status = "waiting";
            await this.gameRepository.save(game);
            return "In Queue";
        }
    }
}
