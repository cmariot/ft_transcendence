import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class FtOauthGuard extends AuthGuard("42") {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const activate: boolean = (await super.canActivate(context)) as boolean;
    await super.logIn(context.switchToHttp().getRequest());
    return activate;
  }
}
