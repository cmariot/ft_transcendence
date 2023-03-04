import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import "./index.css";
import ErrorPage from "./Utils/ErrorPage";

import Auth from "./pages/Auth/Auth";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Validate from "./pages/Register/Validate";
import DoubleAuth from "./pages/DoubleAuth/DoubleAuth";
import Home from "./pages/Home/Home";
import Profile from "./pages/Profile/Profile";
import Friends from "./pages/Friend/Friends";
import Settings from "./pages/Settings/Settings";

import ProtectedPage from "./Utils/ProtectedPage";
import ProtectedValidation from "./Utils/ProtectedValidation";
import ProtectedDoubleAuth from "./Utils/ProtectedDoubleAuth";
import { App } from "./pages/App/App";
import UserProfile, { loader } from "./pages/Profile/UserProfile";
import UnavailableUsername42 from "./pages/Login/UnavailableUsername42";

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
        path: "unavailable-username",
        element: <UnavailableUsername42 />,
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
