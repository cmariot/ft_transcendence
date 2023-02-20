import { createContext } from "react";
import { io, Socket } from "socket.io-client";

export const socket = io("https://localhost:8443");
export const Websocketcontext = createContext<Socket>(socket);
export const WebsocketProvider = Websocketcontext.Provider;