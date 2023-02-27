import { createContext } from "react";
import { io, Socket } from "socket.io-client";

let host: any = process.env.SOCKETHOST;
if (host === undefined) {
    console.log(
        "Error, you must define the websocket host in the frontend .env file."
    );
}

export const socket = io(host);
export const Websocketcontext = createContext<Socket>(socket);
export const WebsocketProvider = Websocketcontext.Provider;
