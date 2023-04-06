import { ChangeEvent, useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/Register.css";
import { MenuContext } from "../../contexts/menu/MenuContext";

export default function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [doubleAuth, setDoubleAuth] = useState(true);
    const menu = useContext(MenuContext);

    const navigate = useNavigate();

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const { id, value } = event.target;
        if (id === "username-register") {
            setUsername(value);
        } else if (id === "email-register") {
            setEmail(value);
        } else if (id === "password-register") {
            setPassword(value);
        }
    };

    const submitRegisterForm = async (event: any) => {
        event.preventDefault();
        if (
            username.length === 0 ||
            password.length === 0 ||
            email.length === 0
        ) {
            menu.displayError("Error, all the fields are required");
            return;
        }
        await axios
            .post("/api/register/", {
                username: username,
                email: email,
                password: password,
                enable2fa: doubleAuth,
            })
            .then(function () {
                setUsername("");
                setEmail("");
                setPassword("");
                navigate("/validate");
            })
            .catch(function (error) {
                if (
                    error.response.data.message &&
                    Object.prototype.toString.call(
                        error.response.data.message
                    ) === "[object Array]"
                ) {
                    menu.displayError(error.response.data.message[0]);
                } else if (error.response.data.message) {
                    menu.displayError(error.response.data.message);
                } else {
                    menu.displayError("Register error");
                }
            });
    };

    return (
        <div className="flex">
            <section id="register-section">
                <aside id="register-aside">
                    <h2>Create your account</h2>
                    <p>
                        Your username must be unique, it will be displayed on
                        the website.
                        <br />
                        You must provide a valid email address
                        <br />
                        And a strong password (min. 10 length characters)
                    </p>
                </aside>
                <form id="register-form" autoComplete="off">
                    <h3>Register</h3>
                    <input
                        id="username-register"
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={handleInputChange}
                        autoFocus
                        required
                    />
                    <input
                        id="password-register"
                        type="password"
                        autoComplete="off"
                        value={password}
                        onChange={handleInputChange}
                        placeholder="Password"
                        required
                    />
                    <input
                        id="email-register"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={handleInputChange}
                        required
                    />
                    <label>
                        Enable Double-Authentification
                        <input
                            id="2fa-register"
                            type="checkbox"
                            defaultChecked={true}
                            onClick={() =>
                                setDoubleAuth((prevState) => !prevState)
                            }
                        />
                    </label>
                    <div>
                        <input
                            id="submit-register"
                            className="button"
                            type="submit"
                            value="Register"
                            onClick={submitRegisterForm}
                        />
                        <Link to="/">cancel</Link>
                    </div>
                </form>
            </section>
        </div>
    );
}
