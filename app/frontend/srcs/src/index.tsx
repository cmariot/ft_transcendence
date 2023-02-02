import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ReactDOM from "react-dom/client";

import Auth from "./Auth/Auth";
import Login from "./Auth/Login/Login";
import Register from "./Auth/Register/Register";

import ProtectedAuth from "./Utils/ProtectedAuth";
import App from "./App/App";
import Home from "./App/Home/Home";
import Profile from "./App/Profile/Profile";
import Settings from "./App/Settings/Settings";
import Validate from "./Auth/Register/Validate";

import "./index.css";
import DoubleAuth from "./Auth/DoubleAuth/DoubleAuth";
import ProtectedValidation from "./Utils/ProtectedValidation";
import AuthNavbar from "./Auth/AuthNavbar";
import AuthFooter from "./Auth/AuthFooter";
import ProtectedDoubleAuth from "./Utils/ProtectedDoubleAuth";

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
                        <ProtectedValidation>
                            <AuthNavbar />
                            <Validate />
                            <AuthFooter />
                        </ProtectedValidation>
                    }
                />
                <Route
                    path="/double-auth"
                    element={
                        <ProtectedDoubleAuth>
                            <AuthNavbar />
                            <DoubleAuth />
                            <AuthFooter />
                        </ProtectedDoubleAuth>
                    }
                />
                <Route
                    path="/"
                    element={
                        <ProtectedAuth>
                            <App />
                        </ProtectedAuth>
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
