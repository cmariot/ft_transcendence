import {
    Body,
    Controller,
    FileTypeValidator,
    Get,
    HttpException,
    HttpStatus,
    MaxFileSizeValidator,
    Param,
    ParseFilePipe,
    Post,
    Req,
    Request,
    StreamableFile,
    UnauthorizedException,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import { UsersService } from "../services/users.service";
import { UsernameDto } from "../dto/Username.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { v4 as uuidv4 } from "uuid";
import * as path from "path";
import { UserEntity } from "../entity/user.entity";
import { isLogged } from "src/auth/guards/authentification.guards";

// Storage for the upload images
export const storage = {
    storage: diskStorage({
        destination: "./uploads/profile_pictures",
        filename: (req, file, cb) => {
            const filename: string =
                path.parse(file.originalname).name.replace(/\s/g, "") +
                uuidv4();
            const extension: string = path.parse(file.originalname).ext;
            cb(null, `${filename}${extension}`);
        },
    }),
};

@Controller("profile")
export class UsersController {
    constructor(private userService: UsersService) {}

    // Get the logged in user profile infos
    @Get()
    @UseGuards(isLogged)
    async profile(@Request() req) {
        let completeUser = await this.userService.getByID(req.user.uuid);
        if (!completeUser) {
            throw new UnauthorizedException("User not found");
        }
        const history = await this.userService.getGameHistory(completeUser);
        const rank = await this.userService.getLeaderBoardRank(completeUser);
        return {
            username: completeUser.username,
            email: completeUser.email,
            twoFactorsAuth: completeUser.twoFactorsAuth,
            firstLog: completeUser.firstLog,
            ratio: completeUser.score,
            gameHistory: history,
            rank: rank,
            notifications: completeUser.notifications,
        };
    }

    // Set firstLog as false in the database
    @Get("confirm")
    @UseGuards(isLogged)
    confirm_profile(@Req() req) {
        return this.userService.confirm_profile(req.user.uuid);
    }

    // Update the username
    @Post("update/username")
    @UseGuards(isLogged)
    async updateUsername(@Body() newUsernameDto: UsernameDto, @Request() req) {
        let previousProfile: UserEntity | null = await this.userService.getByID(
            req.user.uuid
        );
        if (!previousProfile) throw new UnauthorizedException("User not found");
        else if (previousProfile.status !== "online") {
            throw new UnauthorizedException(
                "Your status must be different than " + previousProfile.status
            );
        }
        let previousUsername: string = previousProfile.username;
        let newUsername: string = newUsernameDto.username;
        return this.userService.updateUsername(previousUsername, newUsername);
    }

    // Update the profile image
    @Post("update/image")
    @UseGuards(isLogged)
    @UseInterceptors(FileInterceptor("file", storage))
    async uploadImage(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 10000000 }),
                    new FileTypeValidator({
                        fileType: ".(png|jpeg|jpg)",
                    }),
                ],
            })
        )
        file: Express.Multer.File,
        @Req() req
    ) {
        if (
            file.mimetype !== "image/jpeg" &&
            file.mimetype !== "image/png" &&
            file.mimetype !== "image/jpg"
        ) {
            throw new UnauthorizedException("Wrong file type");
        }
        return await this.userService.updateProfileImage(
            req.user.uuid,
            file.filename
        );
    }

    // Udpate 2fa
    @Post("update/doubleAuth")
    @UseGuards(isLogged)
    async toogleDoubleAuth(@Req() req) {
        return await this.userService.updateDoubleAuth(req.user.uuid);
    }

    // Get a profile image
    @Get(":username/image")
    @UseGuards(isLogged)
    async getImage(@Param() params): Promise<StreamableFile> {
        const user = await this.userService.getByUsername(params.username);
        if (!user)
            throw new HttpException("User not found", HttpStatus.NOT_FOUND);
        return await this.userService.getUserImage(user.profileImage);
    }

    // Get the user profile image
    @Get("image")
    @UseGuards(isLogged)
    async getUserImage(@Req() req): Promise<StreamableFile> {
        const user = await this.userService.getByID(req.user.uuid);
        if (!user)
            throw new HttpException("User not found", HttpStatus.NOT_FOUND);
        return await this.userService.getUserImage(user.profileImage);
    }

    // Add an uuid to the friends list
    @Post("friends/add")
    @UseGuards(isLogged)
    async addFriend(@Body() Username: UsernameDto, @Req() req) {
        return await this.userService.addFriend(
            req.user.uuid,
            Username.username
        );
    }

    // Get the friends list as username array
    @Get("friends")
    @UseGuards(isLogged)
    async friendlist(@Req() req) {
        let user = await this.userService.getByID(req.user.uuid);
        if (!user) {
            throw new UnauthorizedException();
        }
        return await this.userService.friendslist(user.friend);
    }

    // Remove an uuid from the friends
    @Post("friends/remove")
    @UseGuards(isLogged)
    async DeleteFriend(@Body() Username: UsernameDto, @Req() req) {
        return await this.userService.DelFriend(
            req.user.uuid,
            Username.username
        );
    }

    // Add an uuid to the list of blocked users
    @Post("block")
    @UseGuards(isLogged)
    async block_user(@Body() Username: UsernameDto, @Req() req) {
        return await this.userService.blockUser(
            req.user.uuid,
            Username.username
        );
    }

    // Get the usernames list of blocked users
    @Get("blocked")
    @UseGuards(isLogged)
    async blocked_list(@Req() req) {
        let user = await this.userService.getByID(req.user.uuid);
        if (!user) {
            throw new UnauthorizedException();
        }
        return await this.userService.blockedList(user.blocked);
    }

    // Remove an uuid from the blocked
    @Post("unblock")
    @UseGuards(isLogged)
    async unBlock(@Body() Username: UsernameDto, @Req() req) {
        return await this.userService.unBlock(req.user.uuid, Username.username);
    }

    // get the game history and win ratio of an user
    @Post("game")
    @UseGuards(isLogged)
    async getGameHistory(@Body() username: UsernameDto) {
        const user = await this.userService.getByUsername(username.username);
        if (!user) {
            throw new UnauthorizedException("User not found");
        }
        const history = await this.userService.getGameHistory(user);
        const rank = await this.userService.getLeaderBoardRank(user);
        return {
            winRatio: user.score,
            gameHistory: history,
            rank: rank,
        };
    }
}
