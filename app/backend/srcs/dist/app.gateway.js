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
exports.AppGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const socket_io_1 = require("socket.io");
let AppGateway = class AppGateway {
    constructor() {
        this.logger = new common_1.Logger("AppGateway");
        this.Players = [];
        this.P1 = "0";
        this.P2 = "1";
    }
    afterInit(server) {
        this.logger.log("Initialized");
    }
    handleConnection(client, ...args) {
        this.logger.log(`Client connected ${client.id}`);
    }
    handleDisconnect(client) {
        this.logger.log(`Client desconnected ${client.id}`);
    }
    handleMessage(client, payload) {
        client.broadcast.emit("DataToClient", payload);
    }
    handleBall(client, payload) {
        client.broadcast.emit("DataToClient2", payload);
    }
    connect_users(client, payload) {
        if (payload === "init") {
            this.server.emit("connectClient", { P1: this.P1, P2: this.P2 });
            return;
        }
        if ((this.P1 === "0" && this.P2 === "1") ||
            this.P1 === undefined ||
            this.P2 === undefined) {
            this.Players.push(payload.p1 + " " + client.id);
            console.log(this.Players);
            this.P1 = payload.p1;
            this.P2 = payload.p2;
        }
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], AppGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)("DataToServer"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], AppGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("DataToServer2"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], AppGateway.prototype, "handleBall", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("connectServer"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], AppGateway.prototype, "connect_users", null);
AppGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(3080, { cors: { origin: "*" } })
], AppGateway);
exports.AppGateway = AppGateway;
//# sourceMappingURL=app.gateway.js.map