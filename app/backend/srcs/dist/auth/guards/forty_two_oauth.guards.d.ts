import { ExecutionContext } from "@nestjs/common";
declare const FortyTwoOauthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class FortyTwoOauthGuard extends FortyTwoOauthGuard_base {
    canActivate(context: ExecutionContext): Promise<boolean>;
}
export {};
