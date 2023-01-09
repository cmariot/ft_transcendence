import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from "@nestjs/websockets";
import { Logger } from "@nestjs/common";
import { Server, Socket } from "socket.io";

@WebSocketGateway(3080, { cors: { origin: "*" } })
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger: Logger = new Logger("AppGateway");

  @WebSocketServer() server: Server;
  Players: any[] = [];
  P1: string = "0";
  P2: string = "1";

  afterInit(server: Server) {
    this.logger.log("Initialized");
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client desconnected ${client.id}`);
  }

  @SubscribeMessage("DataToServer")
  handleMessage(client: Socket, payload: any): void {
    client.broadcast.emit("DataToClient", payload);
  }

  @SubscribeMessage("DataToServer2")
  handleBall(client: Socket, payload: any): void {
    client.broadcast.emit("DataToClient2", payload);
  }

  @SubscribeMessage("connectServer")
  connect_users(client: Socket, payload: any): void {
    if (payload === "init") {
      this.server.emit("connectClient", { P1: this.P1, P2: this.P2 });
      return;
    }
    if (
      (this.P1 === "0" && this.P2 === "1") ||
      this.P1 === undefined ||
      this.P2 === undefined
    ) {
      this.Players.push(payload.p1 + " " + client.id);
      console.log(this.Players);

      this.P1 = payload.p1;
      this.P2 = payload.p2;
    }
  }
}
