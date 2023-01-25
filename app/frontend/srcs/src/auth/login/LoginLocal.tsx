import axios from "axios";
import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

export function getCookie(key: string): string {
    var value = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
    return value ? value.pop() : "";
}

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
        await axios.post('/api/login',
            {
                username: username,
                password: password
            }
        )
        .then(() => {
            const token = getCookie("authentification");
            if (!token || token === 'undefined') {
				setUsername("");
				setPassword("");
                alert('Unable to login. Please try again.');
                return;
            }
            navigate('/');
        })
        .catch((error) => {
			setUsername("");
			setPassword("");
            alert("Oops! Some error occured.");
        });
    }

    return (
        <div>
            <h2>Login</h2>
            <form>
				<div className="username">
					<label htmlFor="username">
						Username{""}
					</label>
					<input
						type="text"
						id="username"
						placeholder="Username"
						value={username}
						onChange={(e) => handleInputChange(e)}
					/>
				</div>
				<div>
					<label htmlFor="password">
						Password{""}
					</label>
					<input
						type="password"
						id="password"
						placeholder="Password"
						value={password}
						onChange={(e) => handleInputChange(e)}
					/>
				</div>
				<div>
					<button
						onClick={(e) => submitLoginForm(e)}
						type="submit"
					>
						Login
					</button>
				</div>
			</form>
        </div>
    );
}
export default LoginLocal;