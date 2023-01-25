import { useState, ChangeEvent } from 'react';
import axios from "axios";

export default function LoginForm() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const handleLoginInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { id, value } = e.target;
		if (id === "login-username") {
			setUsername(value);
		}
		if (id === "login-password") {
			setPassword(value);
		}
	};

	const handleLoginSubmit = () => {
		axios.post('https://localhost:8443/api/login',
			{
				username: username,
				password: password
			}
		)
			.then(function (response) {
				setUsername("")
				setPassword("")
				console.log(response);
			})
			.catch(function (error) {
				console.log(error);
			})
	};

	return (
		<form id="login-form">
			<h2>Login</h2>
			<div>
				<div>
					<label htmlFor="username">
						Username{""}
					</label>
					<input
						id="login-username"
						type="text"
						value={username}
						onChange={(e) => handleLoginInputChange(e)}
						placeholder="Username"
					/>
				</div>
				<div>
					<label htmlFor="password">
						Password{""}
					</label>
					<input
						id="login-password"
						type="password"
						value={password}
						onChange={(e) => handleLoginInputChange(e)}
						placeholder="Password"
					/>
				</div>
			</div>
			<div>
				<button
					id="login-submit"
					type="submit"
					onClick={handleLoginSubmit}
				>
					Login
				</button>
			</div>
		</form>
	);
}
