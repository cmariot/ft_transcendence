import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { getCookie } from "../../Utils/GetCookie";
import "../CSS/Register.css";

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
        } else if (id === "email") {
            setEmail(value);
        } else if (id === "password") {
            setPassword(value);
        }
    };

    const submitRegisterForm = async (event) => {
        event.preventDefault();
        if (
            username.length === 0 ||
            password.length === 0 ||
            email.length === 0
        ) {
            setError(true);
            setErrorMessage("All the fields are required");
            alert("Error, all the fields are required");
            return;
        }
        await axios
            .post("/api/register", {
                username: username,
                email: email,
                password: password,
            })
            .then(function (response) {
                setError(false);
                setUsername("");
                setEmail("");
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
                if (error.response.data.statusCode === 401) {
                    setErrorMessage(error.response.data.message);
                    alert(error.response.data.message);
                } else if (error.response.data.message.length > 1) {
                    setErrorMessage(error.response.data.message[0]);
                    alert(error.response.data.message[0]);
                } else {
                    setErrorMessage(error.response.data.message);
                    alert(error.response.data.message);
                }
                return;
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
            <article>
                <h2>Create your account</h2>
                <p>
                    Your username must be unique, it will be displayed on the
                    website.
                    <br />
                    You must provide a valid email address
                    <br />
                    And a strong password (min. 10 length characters)
                </p>
            </article>

            <aside>
                <form id="register-form">
                    <h3>Register</h3>
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
                    <input
                        id="email"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(event) => handleInputChange(event)}
                        required
                    />
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(event) => handleInputChange(event)}
                        placeholder="Password"
                        autoComplete="off"
                        required
                    />
                    <div>
                        <input
                            id="submit"
                            className="button"
                            type="submit"
                            value="Register"
                            onClick={(event) => submitRegisterForm(event)}
                        />
                        <Link to="/login">cancel</Link>
                    </div>
                    <>{displayErrorMessage()}</>
                </form>
            </aside>
        </main>
    );
}
