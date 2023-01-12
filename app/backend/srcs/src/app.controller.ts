import { Controller, Get, UseGuards } from "@nestjs/common";

@Controller()
export class AppController {
  @Get()
  home(): string {
    return "Backend's home";
  }
}
