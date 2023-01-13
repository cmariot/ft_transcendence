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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const forty_two_oauth_guards_1 = require("../guards/forty_two_oauth.guards");
const auth_service_1 = require("../service/auth.service");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    forty_two() {
        console.log("forty_two");
        return;
    }
    forty_two_redirect() {
        console.log("forty_two_redirect");
        return;
    }
    login_success() {
        console.log("login_success");
        return this.authService.login_success();
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
    (0, common_1.Redirect)("/auth/login/success"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "forty_two_redirect", null);
__decorate([
    (0, common_1.Get)("login/success"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AuthController.prototype, "login_success", null);
AuthController = __decorate([
    (0, common_1.Controller)("auth"),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map