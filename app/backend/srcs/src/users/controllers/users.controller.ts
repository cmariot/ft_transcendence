import {
    Body,
    Controller,
    FileTypeValidator,
    Get,
    Header,
    MaxFileSizeValidator,
    ParseFilePipe,
    Post,
    Req,
    Request,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import { UsersService } from "../services/users.service";
import { UpdateUsernameDto } from "../dto/UpdateUsername.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { v4 as uuidv4 } from "uuid";
import * as path from "path";
import { UserEntity } from "../entity/user.entity";
import { AuthGuard } from "@nestjs/passport";
import { isLogged } from "src/auth/guards/authentification.guards";
import { EmailGuard } from "src/auth/guards/email.guards";

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
    profile(@Request() req) {
        return this.userService.getProfile(req.user.uuid);
    }

    @Post("update/username")
    @UseGuards(isLogged)
    async updateUsername(
        @Body() newUsernameDto: UpdateUsernameDto,
        @Request() req
    ) {
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

    @Get("image")
    @UseGuards(isLogged)
    getProfileImage(@Req() req) {
        return this.userService.getProfileImage(req.user.uuid);
    }
}
