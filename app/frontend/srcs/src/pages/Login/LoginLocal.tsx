import axios from "axios";
import { ChangeEvent, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../../utils/GetCookie";
import { MenuContext } from "../../contexts/menu/MenuContext";

const LoginLocal = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const menu = useContext(MenuContext);
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

    const submitLoginForm = async (event: any) => {
        event.preventDefault();
        if (username.length === 0 || password.length === 0) {
            menu.displayError("Error, all the fields are required");
            return;
        }
        await axios
            .post("/api/login", {
                username: username,
                password: password,
            })
            .then(() => {
                setUsername("");
                setPassword("");
                if (getCookie("email_validation")) {
                    return navigate("/validate");
                } else if (getCookie("double_authentification")) {
                    return navigate("/double-authentification");
                } else if (getCookie("authentification")) {
                    return navigate("/");
                } else {
                    menu.displayError("Unable to login. Please try again.");
                    return navigate("/login");
                }
            })
            .catch((error) => {
                setUsername("");
                setPassword("");
                menu.displayError(error.response.data.message);
            });
    };

    return (
        <div>
            <h3>Login</h3>
            <form id="login-local-form" autoComplete="off">
                <input
                    type="text"
                    id="username"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => handleInputChange(e)}
                    autoComplete="off"
                    required
                />
                <input
                    type="password"
                    id="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => handleInputChange(e)}
                    autoComplete="off"
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
