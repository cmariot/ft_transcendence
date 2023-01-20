import {
  Controller,
  Get,
  Redirect,
  Request,
  Response,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { FortyTwoOauthGuard } from '../guards/forty_two_oauth.guards';
import { Auth42Service } from '../services/auth.service';

@Controller('auth')
export class Auth42Controller {
  constructor(private authService: Auth42Service) {}

  // Use 42 strategy for Login
  @Get('42')
  @UseGuards(FortyTwoOauthGuard)
  forty_two(): void {}

  // 42 Strategy redirects here, create a connexion cookie
  @Get('42/redirect')
  @UseGuards(FortyTwoOauthGuard)
  async forty_two_redirect(@Request() req, @Response() res) {
    let user = await this.authService.signin_or_register_42_user(req.user);
    if (user == null) {
      throw new UnauthorizedException();
    }
    let authentification_value: string =
      this.authService.generate_jwt_token(user);
    res
      .cookie('authentification', authentification_value, {
        maxAge: 1000 * 60 * 60 * 2, // 2 hours
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      })
      .redirect('https://localhost:8443/');
  }
}
