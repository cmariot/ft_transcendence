import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class FortyTwoOauthGuard extends AuthGuard("42") {
  // context : Current execution context. Provides access to details about the current request pipeline.
  // activate : Value indicating whether or not the current request is allowed to proceed.
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const activate: boolean = (await super.canActivate(context)) as boolean;
    await super.logIn(context.switchToHttp().getRequest());
    return activate;
  }
}
