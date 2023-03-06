import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/Register.css";

export default function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [doubleAuth, setDoubleAuth] = useState(true);

    const navigate = useNavigate();

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
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
            alert("Error, all the fields are required");
            return;
        }
        await axios
            .post("/api/register/", {
                username: username,
                email: email,
                password: password,
                enable2fa: doubleAuth,
            })
            .then(function (response) {
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
                    alert(error.response.data.message[0]);
                } else if (error.response.data.message) {
                    alert(error.response.data.message);
                } else {
                    alert("Register error");
                }
                return;
            });
    };

    return (
        <section id="register-section">
            <aside id="register-aside">
                <h2>Create your account</h2>
                <p>
                    Your username must be unique, it will be displayed on the
                    website.
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
                    onChange={(event) => handleInputChange(event)}
                    autoComplete="off"
                    autoFocus
                    required
                />
                <input
                    id="password-register"
                    type="password"
                    value={password}
                    onChange={(event) => handleInputChange(event)}
                    placeholder="Password"
                    autoComplete="off"
                    required
                />
                <input
                    id="email-register"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(event) => handleInputChange(event)}
                    required
                />
                <label>
                    Enable Double-Authentification
                    <input
                        id="2fa-register"
                        type="checkbox"
                        defaultChecked={true}
                        onClick={() => setDoubleAuth(!doubleAuth)}
                    />
                </label>
                <div>
                    <input
                        id="submit-register"
                        className="button"
                        type="submit"
                        value="Register"
                        onClick={(e) => submitRegisterForm(e)}
                    />
                    <Link to="/">cancel</Link>
                </div>
            </form>
        </section>
    );
}
