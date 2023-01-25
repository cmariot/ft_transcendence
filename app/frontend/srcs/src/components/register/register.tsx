import { ChangeEvent, useState } from "react";
import axios from "axios";

export default function Register() {
	const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

	const [submitted, setSubmitted] = useState(false);
	const [error, setError] = useState(false);
	const [msg, setMsg] = useState("");


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

    const handleSubmit = () => {
        console.log(username, email, password);
        axios.post('https://localhost:8443/api/register',
            {
                username: username,
                email: email,
                password: password
            }
        )
            .then(function (response) {
				setSubmitted(true);
                console.log(response);
            })
            .catch(function (error) {
				setError(true);
				setMsg(error);
                console.log(error);
            })
    };

	const errorMessage = () => {
		return (
			<div
			className="success"
			style={{
			  display: error ? '' : 'none',
			}}>
			<h1>Error : {error} </h1>
		  </div>
		);
	};

	const successMessage = () => {
		return (
		  <div
			className="success"
			style={{
			  display: submitted ? '' : 'none',
			}}>
			<h1>User {username} successfully registered!!</h1>
		  </div>
		);
	  };

    return (
        <div id="register-form" className="form">
			 <div className="messages">
        		{successMessage()}
				{errorMessage()}
      		</div>
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
                    onClick={() => handleSubmit()}
                    type="submit"
                    className="btn"
                >
                    Register
                </button>
            </div>
        </div>
    );
}