import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter } from "react-router-dom";

import UserProvider from "./Contexts/UserProvider";

import "./index.css";
import ErrorPage from "./Utils/ErrorPage";

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Validate from "./pages/Register/Validate";
import DoubleAuth from "./pages/DoubleAuth/DoubleAuth";

import UnavailableUsername42 from "./pages/Login/UnavailableUsername42";
import { App } from "./components/App";

const loginRouter = createBrowserRouter([
    //{
    //    index: true,
    //    element: <Home />,
    //},
    //{
    //    path: "profile",
    //    element: <Profile />,
    //},
    //{
    //    path: "profile/:user",
    //    element: <UserProfile />,
    //    loader: loader,
    //},
    //{
    //    path: "friends",
    //    element: <Friends />,
    //},
    //{
    //    path: "settings",
    //    element: <Settings />,
    //},
    {
        path: "login",
        element: <Login />,
    },
    {
        path: "register",
        element: <Register />,
    },
    {
        path: "unavailable-username",
        element: <UnavailableUsername42 />,
    },
    {
        path: "validate",
        element: <Validate />,
    },
    {
        path: "double-authentification",
        element: <DoubleAuth />,
    },
]);

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);

root.render(
    <React.StrictMode>
        <UserProvider>
            {/* <ChatProvider> */}
            {/* <GameProvider> */}

            <App />

            {/* <GameProvider> */}
            {/* </ChatProvider> */}
        </UserProvider>
    </React.StrictMode>
);
