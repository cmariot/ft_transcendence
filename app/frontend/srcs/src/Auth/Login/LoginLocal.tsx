import axios from "axios";
import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../../Utils/GetCookie";

const LoginLocal = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const { id, value } = event.target;
        if (id === "username") {
            setUsername(value);
        }
        if (id === "password") {
            setPassword(value);
        }
    };

    const submitLoginForm = async (event) => {
        event.preventDefault();
        await axios
            .post("/api/login", {
                username: username,
                password: password,
            })
            .then(() => {
                const token = getCookie("authentification");
                if (!token || token === "undefined") {
                    setUsername("");
                    setPassword("");
                    alert("Unable to login. Please try again.");
                    return;
                }
                navigate("/");
            })
            .catch((error) => {
                setUsername("");
                setPassword("");
                alert(error.response.data.message);
            });
    };

    return (
        <div>
            <h2>Login</h2>
            <form>
                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    id="username"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => handleInputChange(e)}
                    autoComplete="on"
                    required
                />
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => handleInputChange(e)}
                    autoComplete="on"
                    required
                />
                <input
                    type="submit"
                    className="button"
                    onClick={(e) => submitLoginForm(e)}
                    value="Login"
                />
            </form>
        </div>
    );
};
export default LoginLocal;
