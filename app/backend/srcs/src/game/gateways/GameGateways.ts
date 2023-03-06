import { Injectable } from "@nestjs/common";
import { Server } from "socket.io";
import {
    MessageBody,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets";

@Injectable()
@WebSocketGateway(3001, { cors: { origin: "http://frontend" } })
export class GameGateway {
    @WebSocketServer()
    server: Server;
}
