import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import UnavailableUsername42 from "../pages/Login/UnavailableUsername42";
import Validate from "../pages/Register/Validate";
import DoubleAuth from "../pages/DoubleAuth/DoubleAuth";
import { Body } from "../components/Body";

export const loginRouter = createBrowserRouter([
    {
        path: "/",
        element: <Body />,
        children: [
            {
                index: true,
                element: <Login />,
            },
            {
                path: "register",
                element: <Register />,
            },
            {
                path: "validate",
                element: <Validate />,
            },
            {
                path: "double-authentification",
                element: <DoubleAuth />,
            },
            {
                path: "unavailable-username",
                element: <UnavailableUsername42 />,
            },
        ],
    },
]);
