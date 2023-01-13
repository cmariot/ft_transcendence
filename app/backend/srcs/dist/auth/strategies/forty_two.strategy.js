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
exports.FortyTwoStrategy = void 0;
const passport_42_1 = require("passport-42");
const passport_1 = require("@nestjs/passport");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const auth_service_1 = require("../service/auth.service");
let FortyTwoStrategy = class FortyTwoStrategy extends (0, passport_1.PassportStrategy)(passport_42_1.Strategy, "42") {
    constructor(configService, authService) {
        super({
            clientID: configService.get("UID_42_SECRET"),
            clientSecret: configService.get("PASSWORD_SECRET_42"),
            callbackURL: configService.get("CALLBACK_URL"),
            passReqToCallback: true,
        });
        this.configService = configService;
        this.authService = authService;
    }
    async validate(request, accessToken, refreshToken, profile, cb) {
        request.session.accessToken = accessToken;
        let user = {
            id: parseInt(profile.id),
            username: profile.username,
            displayName: profile.displayName,
            email: profile.emails[0].value,
        };
        this.authService.validateUser(user, accessToken);
        return cb(null, profile);
    }
};
FortyTwoStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        auth_service_1.AuthService])
], FortyTwoStrategy);
exports.FortyTwoStrategy = FortyTwoStrategy;
//# sourceMappingURL=forty_two.strategy.js.map