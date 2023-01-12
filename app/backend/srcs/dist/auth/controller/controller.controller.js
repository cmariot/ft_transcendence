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
let AuthController = class AuthController {
    forty_two() {
        return "authenticate via passport-42";
    }
    login_success() {
        return "login success + user informations";
    }
    login_failure() {
        return "login failure";
    }
    forty_two_redirect() {
        return "redirect to home page if login succeeded or redirect to /auth/login/failed if failed";
    }
};
__decorate([
    (0, common_1.Get)("42"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AuthController.prototype, "forty_two", null);
__decorate([
    (0, common_1.Get)("login/success"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AuthController.prototype, "login_success", null);
__decorate([
    (0, common_1.Get)("login/failure"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AuthController.prototype, "login_failure", null);
__decorate([
    (0, common_1.Get)("42/redirect"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AuthController.prototype, "forty_two_redirect", null);
AuthController = __decorate([
    (0, common_1.Controller)("auth")
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=controller.controller.js.map