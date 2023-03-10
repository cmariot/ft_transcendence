import React from "react";
import ReactDOM from "react-dom/client";
import UserProvider from "./contexts/UserProvider";
import "./styles/index.css";
import "./styles/Theme.css";
import { router } from "./routers/router";
import { RouterProvider } from "react-router-dom";
import MenuProvider from "./contexts/MenuProviders";
import ChatProvider from "./contexts/ChatProvider";
import SocketProvider from "./contexts/SocketProvider";
import GameProvider from "./contexts/GameProvider";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);

root.render(
    <React.StrictMode>
        <UserProvider>
            <ChatProvider>
                <GameProvider>
                    <MenuProvider>
                        <SocketProvider>
                            <RouterProvider router={router} />
                        </SocketProvider>
                    </MenuProvider>
                </GameProvider>
            </ChatProvider>
        </UserProvider>
    </React.StrictMode>
);
