import React from "react";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";

import AuthNavbar from "./Auth/AuthNavbar";
import AuthFooter from "./Auth/AuthFooter";
import Login from "./Auth/Login/Login";
import Register from "./Auth/Register/Register";

import ProtectedPage from "./Utils/ProtectedPage";
import App from "./App/App";
import Home from "./App/Home/Home";
import Profile from "./App/Profile/Profile";
import Settings from "./App/Settings/Settings";

import ProtectedValidation from "./Utils/ProtectedValidation";
import Validate from "./Auth/Register/Validate";

import ProtectedDoubleAuth from "./Utils/ProtectedDoubleAuth";
import DoubleAuth from "./Auth/DoubleAuth/DoubleAuth";
import Friends from "./App/Friend/Friends";

import "./index.css";

import ReactDOM from "react-dom/client";
import "./index.css";
import AppFooter from "./App/AppFooter";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route
                    element={
                        <>
                            <AuthNavbar />
                            <Outlet />
                            <AppFooter />
                        </>
                    }
                >
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Route>
                <Route
                    element={
                        <>
                            <ProtectedValidation />
                        </>
                    }
                >
                    <Route
                        path="/validate"
                        element={
                            <>
                                <AuthNavbar />
                                <Validate />
                                <AuthFooter />
                            </>
                        }
                    />
                </Route>
                <Route
                    path="/double-auth"
                    element={
                        <>
                            <AuthNavbar />
                            <ProtectedDoubleAuth>
                                <DoubleAuth />
                            </ProtectedDoubleAuth>
                            <AuthFooter />
                        </>
                    }
                />
                <Route
                    element={
                        <ProtectedPage>
                            <App />
                        </ProtectedPage>
                    }
                >
                    <Route path="/" element={<Home />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/friends" element={<Friends />} />
                    <Route path="/settings" element={<Settings />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);
