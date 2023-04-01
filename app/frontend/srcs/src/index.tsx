import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import "./styles/Theme.css";
import { router } from "./routers/router";
import { RouterProvider } from "react-router-dom";
import ContextProviders from "./contexts/ContextProviders";
import WSEvents from "./events/WSEvents";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);

root.render(
    <React.StrictMode>
        <ContextProviders>
            <WSEvents>
                <RouterProvider router={router} />
            </WSEvents>
        </ContextProviders>
    </React.StrictMode>
);
