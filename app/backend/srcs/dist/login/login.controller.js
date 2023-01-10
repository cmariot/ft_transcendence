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
exports.LoginController = void 0;
const common_1 = require("@nestjs/common");
const ft_oauth_guard_1 = require("./guards/ft-oauth.guard");
let LoginController = class LoginController {
    login() {
        return;
    }
    callback() {
        return;
    }
};
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(ft_oauth_guard_1.FtOauthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LoginController.prototype, "login", null);
__decorate([
    (0, common_1.Get)("callback"),
    (0, common_1.UseGuards)(ft_oauth_guard_1.FtOauthGuard),
    (0, common_1.Redirect)("/"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LoginController.prototype, "callback", null);
LoginController = __decorate([
    (0, common_1.Controller)("login")
], LoginController);
exports.LoginController = LoginController;
//# sourceMappingURL=login.controller.js.map