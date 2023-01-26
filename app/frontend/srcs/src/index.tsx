import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import ReactDOM from "react-dom/client";
import ProtectedRoute from "./util/ProtectedRoute";
import Home from "./home/home/Home";
import React from "react";
import Login from "./auth/Login";
import Register from "./auth/Register";
import "./index.css";
import Auth from "./auth/Auth";
import Profile from "./home/home/Profile";

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
                    path="/"
                    element={
                        <ProtectedRoute>
                            <App />
                        </ProtectedRoute>
                    }
                >
                    <Route path="/" element={<Home />} />
                    <Route path="/profile" element={<Profile />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);
