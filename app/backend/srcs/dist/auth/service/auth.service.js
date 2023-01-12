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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../../users/services/users/users.service");
let AuthService = class AuthService {
    constructor(usersService) {
        this.usersService = usersService;
    }
    login_success() {
        return "login success + user informations";
    }
    login_failure() {
        return "login failure";
    }
    logout() {
        return "logout";
    }
    forty_two() {
        return "authenticate via passport-42";
    }
    forty_two_redirection() {
        return "redirect to home page if login succeeded or redirect to /auth/login/failed if failed";
    }
    async validateUser(user, access_token) {
        const updated_user = await this.usersService.createUser(user);
        if (updated_user && access_token) {
            console.log(access_token);
            return updated_user;
        }
        return null;
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map