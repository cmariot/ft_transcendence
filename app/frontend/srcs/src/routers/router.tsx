import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import UnavailableUsername42 from "../pages/Login/UnavailableUsername42";
import Validate from "../pages/Register/Validate";
import DoubleAuth from "../pages/DoubleAuth/DoubleAuth";
import { Body } from "../components/Body";
import Home from "../pages/Home/Home";
import Profile from "../pages/Profile/Profile";
import UserProfile, { loader } from "../pages/Profile/UserProfile";
import Friends from "../pages/Friend/Friends";
import Settings from "../pages/Settings/Settings";
import ConfirmProfile from "../pages/Settings/ConfirmProfile";
import ProtectedPage from "../Utils/ProtectedPage";
import ProtectedValidation from "../Utils/ProtectedValidation";
import ProtectedDoubleAuth from "../Utils/ProtectedDoubleAuth";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Body />,
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
                element: <ProtectedPage />,
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
                    {
                        path: "welcome",
                        element: <ConfirmProfile />,
                    },
                ],
            },
            {
                element: <ProtectedValidation />,
                children: [
                    {
                        path: "validate",
                        element: <Validate />,
                    },
                ],
            },
            {
                element: <ProtectedDoubleAuth />,
                children: [
                    {
                        path: "double-authentification",
                        element: <DoubleAuth />,
                    },
                ],
            },
            {
                path: "unavailable-username",
                element: <UnavailableUsername42 />,
            },
        ],
    },
]);
