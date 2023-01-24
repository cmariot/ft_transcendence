import {
    Body,
    Controller,
    Get,
    Post,
    Request,
    UnauthorizedException,
    UseGuards,
} from "@nestjs/common";
import { isLogged } from "src/auth/guards/is_logged.guards";
import { UsersService } from "../services/users.service";
import { UpdateUsernameDto } from "../dto/UpdateUsername.dto";

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
}
