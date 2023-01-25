import {
    Body,
    Controller,
    Get,
    Post,
    Req,
    Request,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import { isLogged } from "src/auth/guards/is_logged.guards";
import { UsersService } from "../services/users.service";
import { UpdateUsernameDto } from "../dto/UpdateUsername.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { v4 as uuidv4 } from "uuid";
import * as path from "path";
import { Observable, of } from "rxjs";

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
        console.log("Updating username");
        let previousProfile = await this.userService.getProfile(req.user.uuid);
        let previousUsername = previousProfile.username;
        let newUsername = newUsernameDto.username;
        return this.userService.updateUsername(previousUsername, newUsername);
    }

    @Post("update/image")
    @UseGuards(isLogged)
    @UseInterceptors(FileInterceptor("file", storage))
    async uploadImage(@UploadedFile() file: Express.Multer.File, @Req() req) {
        console.log("Updating image");
        let user = await this.userService.getByID(req.user.uuid);
        if (user.profileImage != null) {
            console.log("Delete the previous profile picture");
        }
        await this.userService.updateProfileImage(req.user.uuid, file.filename);
        return "OK";
    }

    @Get("image")
    @UseGuards(isLogged)
    async getProfileImage() {
        return "Profile image";
    }
}
