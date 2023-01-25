import { Controller, Get, Res, UseGuards } from "@nestjs/common";
import { isLogged } from "../guards/is_logged.guards";

@Controller("logout")
export class LogoutController {
    @Get()
    @UseGuards(isLogged)
    logout(@Res() res): void {
        return res.clearCookie("authentification").send("Bye !");
    }
}
