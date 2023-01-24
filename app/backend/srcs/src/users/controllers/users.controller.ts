import {
    Body,
    Controller,
    Get,
    Post,
    Request,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import { isLogged } from "src/auth/guards/is_logged.guards";
import { UsersService } from "../services/users.service";
import { UpdateUsernameDto } from "../dto/UpdateUsername.dto";
import { FileInterceptor } from "@nestjs/platform-express";

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
    @UseInterceptors(FileInterceptor("file"))
    async updateImage(@UploadedFile() file: Express.Multer.File) {
        console.log("Updating image");
        console.log(file);
    }
}
