import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ReactDOM from "react-dom/client";

import Auth from "./Auth/Auth";
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

import "./index.css";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route element={<Auth />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Route>
                <Route
                    path="/validate"
                    element={
                        <>
                            <AuthNavbar />
                            <ProtectedValidation>
                                <Validate />
                            </ProtectedValidation>
                            <AuthFooter />
                        </>
                    }
                />
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
                    path="/"
                    element={
                        <ProtectedPage>
                            <App />
                        </ProtectedPage>
                    }
                >
                    <Route path="/" element={<Home />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/settings" element={<Settings />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);
