import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ReactDOM from "react-dom/client";

import Auth from "./Auth/Auth";
import Login from "./Auth/Login/Login";
import Register from "./Auth/Register/Register";

import ProtectedRoute from "./Utils/ProtectedRoute";
import App from "./App/App";
import Home from "./App/Home/Home";
import Profile from "./App/Profile/Profile";
import Settings from "./App/Settings/Settings";
import Validate from "./Auth/Register/Validate";

import Friends from "./App/Friend/Friends";

import "./index.css";
import AuthNavbar from "./Auth/AuthNavbar";
import AuthFooter from "./Auth/AuthFooter";

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
                        <ProtectedRoute>
                            <AuthNavbar />
                            <Validate />
                            <AuthFooter />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <App />
                        </ProtectedRoute>
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
