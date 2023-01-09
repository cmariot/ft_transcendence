import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
export declare class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private logger;
    server: Server;
    Players: any[];
    P1: string;
    P2: string;
    afterInit(server: Server): void;
    handleConnection(client: Socket, ...args: any[]): void;
    handleDisconnect(client: Socket): void;
    handleMessage(client: Socket, payload: any): void;
    handleBall(client: Socket, payload: any): void;
    connect_users(client: Socket, payload: any): void;
}
