import React from "react";
import ReactDOM from "react-dom/client";
import UserProvider from "./Contexts/UserProvider";
import "./index.css";
import "./styles/Theme.css";
import { router } from "./routers/router";
import { RouterProvider } from "react-router-dom";
import MenuProvider from "./Contexts/MenuProviders";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);

root.render(
    <React.StrictMode>
        <UserProvider>
            {/* <ChatProvider> */}
            {/* <GameProvider> */}
            <MenuProvider>
                <RouterProvider router={router} />
            </MenuProvider>
            {/* <GameProvider> */}
            {/* </ChatProvider> */}
        </UserProvider>
    </React.StrictMode>
);
