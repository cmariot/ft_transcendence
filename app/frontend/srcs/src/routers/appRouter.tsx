import { createBrowserRouter } from "react-router-dom";
import { Body } from "../components/Body";
import Home from "../pages/Home/Home";
import Profile from "../pages/Profile/Profile";
import UserProfile, { loader } from "../pages/Profile/UserProfile";
import Friends from "../pages/Friend/Friends";
import Settings from "../pages/Settings/Settings";

export const appRouter = createBrowserRouter([
    {
        path: "/",
        element: <Body />,
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
                path: "friends",
                element: <Friends />,
            },
            {
                path: "profile/:user",
                element: <UserProfile />,
                loader: loader,
            },
            {
                path: "settings",
                element: <Settings />,
            },
        ],
    },
]);
