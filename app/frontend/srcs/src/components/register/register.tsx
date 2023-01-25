import { ChangeEvent, useState } from "react";
import axios from "axios";

export default function RegisterForm() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegisterInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        if (id === "register-username") {
            setUsername(value);
            console.log(username)
        }
        if (id === "register-email") {
            setEmail(value);
        }
        if (id === "register-password") {
            setPassword(value);
        }
    };

    const handleRegisterSubmit = () => {
        axios.post('https://localhost:8443/api/register',
            {
                username: username,
                email: email,
                password: password
            },
        )
            .then(function (response) {
                console.log(response);
                setUsername("");
                setEmail("");
                setPassword("");
            })
            .catch(function (error) {
                console.log(error);
            })
    };

    return (
        <form>
            <h2>Create an account</h2>
            <div>
                <label htmlFor="username">
                    Username{""}
                </label>
                <input
                    id="register-username"
                    type="text"
                    value={username}
                    onChange={(e) => handleRegisterInputChange(e)}
                    placeholder="Username"
                />
            </div>
            <div>
                <label htmlFor="email">
                    Email{""}
                </label>
                <input
                    id="register-email"
                    type="email"
                    value={email}
                    onChange={(e) => handleRegisterInputChange(e)}
                    placeholder="Email"
                />
            </div>
            <div>
                <label htmlFor="password">
                    Password{""}
                </label>
                <input
                    id="register-password"
                    type="password"
                    value={password}
                    onChange={(e) => handleRegisterInputChange(e)}
                    placeholder="Password"
                />
            </div>
            <button
                type="submit"
                onClick={handleRegisterSubmit}
            >
                Register
            </button>
        </form>
    );
}
