import { ExecutionContext } from "@nestjs/common";
declare const FtOauthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class FtOauthGuard extends FtOauthGuard_base {
    canActivate(context: ExecutionContext): Promise<boolean>;
}
export {};
