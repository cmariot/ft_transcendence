"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const users_module_1 = require("../users/users.module");
const auth_controller_1 = require("./controller/auth.controller");
const auth_service_1 = require("./service/auth.service");
const forty_two_strategy_1 = require("./strategies/forty_two.strategy");
const session_serializer_1 = require("./session.serializer");
const config_1 = require("@nestjs/config");
const users_service_1 = require("../users/services/users/users.service");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../users/entity/user.entity");
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [users_module_1.UsersModule, passport_1.PassportModule, typeorm_1.TypeOrmModule.forFeature([user_entity_1.User])],
        providers: [
            auth_service_1.AuthService,
            config_1.ConfigService,
            forty_two_strategy_1.FortyTwoStrategy,
            users_service_1.UsersService,
            session_serializer_1.SessionSerializer,
        ],
        controllers: [auth_controller_1.AuthController],
    })
], AuthModule);
exports.AuthModule = AuthModule;
//# sourceMappingURL=auth.module.js.map