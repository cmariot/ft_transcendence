"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const forty_two_oauth_guards_1 = require("../guards/forty_two_oauth.guards");
const auth_service_1 = require("../service/auth.service");
const jwt_auth_guards_1 = require("../guards/jwt_auth.guards");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    forty_two() {
        return;
    }
    async forty_two_redirect(req, res) {
        let jwt_token_value = this.authService.login(req.user);
        res
            .cookie("jwt_token", jwt_token_value, {
            maxAge: 1000 * 60 * 60 * 1,
            httpOnly: true,
            sameSite: "none",
            secure: true,
        })
            .redirect("https://localhost:4242/");
        return;
    }
    test() {
        return "You see that because you're logged in !";
    }
    logout(res) {
        res.clearCookie("jwt_token").redirect("https://localhost:4242/");
    }
};
__decorate([
    (0, common_1.Get)("42"),
    (0, common_1.UseGuards)(forty_two_oauth_guards_1.FortyTwoOauthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "forty_two", null);
__decorate([
    (0, common_1.Get)("42/redirect"),
    (0, common_1.UseGuards)(forty_two_oauth_guards_1.FortyTwoOauthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forty_two_redirect", null);
__decorate([
    (0, common_1.Get)("test"),
    (0, common_1.UseGuards)(jwt_auth_guards_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AuthController.prototype, "test", null);
__decorate([
    (0, common_1.Get)("logout"),
    (0, common_1.UseGuards)(jwt_auth_guards_1.JwtAuthGuard),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logout", null);
AuthController = __decorate([
    (0, common_1.Controller)("auth"),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map