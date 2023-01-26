import "./Register.css";
import axios from "axios";
import { ChangeEvent, useState } from "react";
import { getCookie } from "./login/LoginLocal";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        if (id === "username") {
            setUsername(value);
        }
        if (id === "email") {
            setEmail(value);
        }
        if (id === "password") {
            setPassword(value);
        }
    };

    const submitRegisterForm = async (event) => {
        event.preventDefault();
        await axios
            .post("/api/register", {
                username: username,
                email: email,
                password: password,
            })
            .then(function (response) {
                setError(false);
                setUsername("");
                setPassword("");
                const token = getCookie("authentification");
                if (!token || token === "undefined") {
                    alert("Unable to register. Please try again.");
                    return;
                }
                navigate("/");
            })
            .catch(function (error) {
                setError(true);
                setErrorMessage(error.response.data.message);
                alert("Oops! Some error occured.");
            });
    };

    const displayErrorMessage = () => {
        return (
            <p style={{ display: error ? "inline" : "none" }}>
                Error: {errorMessage}
            </p>
        );
    };

    return (
        <main id="register-main">
            <h2>Register</h2>
            <form id="register-form">
                <label htmlFor="username">Username</label>
                <input
                    id="username"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(event) => handleInputChange(event)}
                    autoComplete="off"
                    autoFocus
                    required
                />
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(event) => handleInputChange(event)}
                    required
                />
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => handleInputChange(event)}
                    placeholder="Password"
                    autoComplete="off"
                    required
                />
                <input
                    id="submit"
                    className="button"
                    type="submit"
                    value="Register"
                    onClick={(event) => submitRegisterForm(event)}
                />
                <>{displayErrorMessage()}</>
            </form>
            <Link to="/login">cancel</Link>
        </main>
    );
}
