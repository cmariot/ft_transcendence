import axios from "axios";
import { ChangeEvent, useState } from "react";
import { getCookie } from "./login/LoginLocal";
import { useNavigate } from "react-router-dom";

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
            .then(function () {
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
                alert(errorMessage);
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
        <div id="register-form" className="form">
            <h2>Register</h2>
            <div className="form-body">
                <div className="username">
                    <label className="form__label" htmlFor="username">
                        Username{" "}
                    </label>
                    <input
                        className="form__input"
                        type="text"
                        value={username}
                        onChange={(e) => handleInputChange(e)}
                        id="username"
                        placeholder="Username"
                    />
                </div>
                <div className="email">
                    <label className="form__label" htmlFor="email">
                        Email{" "}
                    </label>
                    <input
                        type="email"
                        id="email"
                        className="form__input"
                        value={email}
                        onChange={(e) => handleInputChange(e)}
                        placeholder="Email"
                    />
                </div>
                <div className="password">
                    <label className="form__label" htmlFor="password">
                        Password{" "}
                    </label>
                    <input
                        className="form__input"
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => handleInputChange(e)}
                        placeholder="Password"
                    />
                </div>
            </div>
            <div className="footer">
                <button
                    onClick={(e) => submitRegisterForm(e)}
                    type="submit"
                    className="btn"
                >
                    Register
                </button>
                <div className="messages">{displayErrorMessage()}</div>
            </div>
        </div>
    );
}
