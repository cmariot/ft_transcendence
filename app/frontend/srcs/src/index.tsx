import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import "./index.css";
import Auth from "./Auth/Auth";
import ErrorPage from "./Utils/ErrorPage";
import Login from "./Auth/Login/Login";
import Register from "./Auth/Register/Register";
import Validate from "./Auth/Register/Validate";
import DoubleAuth from "./Auth/DoubleAuth/DoubleAuth";
import Home from "./App/Home/Home";
import Profile from "./App/Profile/Profile";
import Friends from "./App/Friend/Friends";
import Settings from "./App/Settings/Settings";
import ProtectedPage from "./Utils/ProtectedPage";
import ProtectedValidation from "./Utils/ProtectedValidation";
import ProtectedDoubleAuth from "./Utils/ProtectedDoubleAuth";
import { App } from "./App/App";
import UserProfile, { loader } from "./App/Profile/UserProfile";

const router = createBrowserRouter([
    {
        path: "/",
        errorElement: <ErrorPage />,
        element: <ProtectedPage />,
        children: [
            {
                element: <App />,
                children: [
                    {
                        index: true,
                        element: <Home />,
                    },
                    {
                        path: "profile",
                        element: <Profile />,
                    },
                    {
                        path: "profile/:user",
                        element: <UserProfile />,
                        loader: loader,
                    },
                    {
                        path: "friends",
                        element: <Friends />,
                    },
                    {
                        path: "settings",
                        element: <Settings />,
                    },
                ],
            },
        ],
    },
    {
        path: "/",
        errorElement: <ErrorPage />,
        element: <Auth />,
        children: [
            {
                path: "login",
                element: <Login />,
            },
            {
                path: "register",
                element: <Register />,
            },
            {
                path: "validate",
                element: <ProtectedValidation />,
                children: [
                    {
                        path: "",
                        element: <Validate />,
                    },
                ],
            },
            {
                path: "double-authentification",
                element: <ProtectedDoubleAuth />,
                children: [
                    {
                        path: "",
                        element: <DoubleAuth />,
                    },
                ],
            },
        ],
    },
]);

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);
root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
