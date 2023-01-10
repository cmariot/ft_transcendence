"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ft_strategy_1 = require("./ft.strategy");
const login_controller_1 = require("./login.controller");
const session_serializer_1 = require("./session.serializer");
let LoginModule = class LoginModule {
};
LoginModule = __decorate([
    (0, common_1.Module)({
        controllers: [login_controller_1.LoginController],
        providers: [config_1.ConfigService, ft_strategy_1.FtStrategy, session_serializer_1.SessionSerializer],
    })
], LoginModule);
exports.LoginModule = LoginModule;
//# sourceMappingURL=login.module.js.map