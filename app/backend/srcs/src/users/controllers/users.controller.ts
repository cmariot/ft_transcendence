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

    @Get()
    @UseGuards(isLogged)
    async profile(@Request() req) {
        let completeUser = await this.userService.getProfile(req.user.uuid);
        if (completeUser != null)
            return {
                uuid: completeUser.uuid,
                username: completeUser.username,
                twoFactorsAuth: completeUser.twoFactorsAuth,
                firstLog: completeUser.firstLog,
            };
        throw new UnauthorizedException();
    }

    @Post("update/username")
    @UseGuards(isLogged)
    async updateUsername(@Body() newUsernameDto: UsernameDto, @Request() req) {
        let previousProfile: UserEntity = await this.userService.getProfile(
            req.user.uuid
        );
        let previousUsername: string = previousProfile.username;
        let newUsername: string = newUsernameDto.username;
        return this.userService.updateUsername(previousUsername, newUsername);
    }

    @Post("update/image")
    @UseGuards(isLogged)
    @UseInterceptors(FileInterceptor("file", storage))
    async uploadImage(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 10000000 }),
                    new FileTypeValidator({
                        fileType: /(jpg|jpeg|png|gif)$/,
                    }),
                ],
            })
        )
        file: Express.Multer.File,
        @Req() req
    ) {
        let user = await this.userService.getByID(req.user.uuid);
        if (user.profileImage != null) {
            this.userService.deletePreviousProfileImage(user.uuid);
        }
        await this.userService.updateProfileImage(req.user.uuid, file.filename);
        return "OK";
    }

    @Post("update/doubleAuth")
    @UseGuards(isLogged)
    async toogleDoubleAuth(@Req() req) {
        const user = await this.userService.getByID(req.user.uuid);
        const newValue = !user.twoFactorsAuth;
        await this.userService.updateDoubleAuth(req.user.uuid, newValue);
        return "OK";
    }

    @Get(":username/image")
    @UseGuards(isLogged)
    async getUserImage(@Param() params, @Req() req) {
        const user = await this.userService.getByUsername(params.username);
        if (!user)
            throw new HttpException("User not found", HttpStatus.NOT_FOUND);
        return await this.userService.getProfileImage(user.uuid);
    }

    @Get("image")
    @UseGuards(isLogged)
    async getProfileImage(@Req() req) {
        return await this.userService.getProfileImage(req.user.uuid);
    }

    @Get("2fa")
    @UseGuards(isLogged)
    async get2faenable(@Req() req) {
        const user = await this.userService.getByID(req.uuid);
        return user.twoFactorsAuth;
    }

    @Post("friends/add")
    @UseGuards(isLogged)
    async addFriend(@Body() Username: UsernameDto, @Req() req) {
        let friend = await this.userService.getByUsername(Username.username);
        if (!friend)
            throw new HttpException(
                "Friend not found !",
                HttpStatus.BAD_REQUEST
            );
        return await this.userService.addFriend(req.user.uuid, friend.uuid);
    }

    @Get("friends")
    @UseGuards(isLogged)
    async friendlist(@Req() req) {
        return await this.userService.friendslist(req.user.uuid);
    }

    @Post("friends/remove")
    @UseGuards(isLogged)
    async DeleteFriend(@Body() Username: UsernameDto, @Req() req) {
        let friend = await this.userService.getByUsername(Username.username);
        if (!friend)
            throw new HttpException(
                "Friend not found !",
                HttpStatus.BAD_REQUEST
            );
        return await this.userService.DelFriend(req.user.uuid, friend.uuid);
    }

    @Post("block")
    @UseGuards(isLogged)
    async block_user(@Body() Username: UsernameDto, @Req() req) {
        let block = await this.userService.getByUsername(Username.username);
        if (!block)
            throw new HttpException("User not found !", HttpStatus.BAD_REQUEST);
        let list = await this.userService.blockUser(req.user.uuid, block.uuid);
        return list;
    }

    @Get("blocked")
    @UseGuards(isLogged)
    async blocked_list(@Req() req) {
        return await this.userService.blockedList(req.user.uuid);
    }

    @Post("unblock")
    @UseGuards(isLogged)
    async unBlock(@Body() Username: UsernameDto, @Req() req) {
        let block = await this.userService.getByUsername(Username.username);
        if (!block)
            throw new HttpException("User not found !", HttpStatus.BAD_REQUEST);
        return await this.userService.unBlock(req.user.uuid, block.uuid);
    }

    @Get("confirm")
    @UseGuards(isLogged)
    confirm_profile(@Req() req) {
        return this.userService.confirm_profile(req.user.uuid);
    }
}
