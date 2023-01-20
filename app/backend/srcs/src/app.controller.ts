import { Controller, Get, UseGuards } from "@nestjs/common";

@Controller()
export class AppController {
  constructor() {}

  @Get()
  home(): string {
    return "Backend's home";
  }
}
