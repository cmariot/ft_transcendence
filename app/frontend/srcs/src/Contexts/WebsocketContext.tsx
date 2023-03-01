import { createContext } from "react";
import { io, Socket } from "socket.io-client";

let host: any = process.env.SOCKETHOST;
export const socket = io(host);
export const Websocketcontext = createContext<Socket>(socket);
export const WebsocketProvider = Websocketcontext.Provider;
