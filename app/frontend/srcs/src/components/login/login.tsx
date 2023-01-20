import axios from "axios";
import React, { useState } from 'react';
import { ChangeEvent } from "react";

function Login() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { id, value } = e.target;
		if (id === "username") {
			setUsername(value);
		}
		if (id === "password") {
			setPassword(value);
		}
	};

	const handleSubmit = () => {
		console.log(username, password);
		axios.post('https://localhost:8443/api/login',
			{
				username: username,
				password: password
			}
		)
			.then(function (response) {
				console.log(response);
			})
			.catch(function (error) {
				console.log(error);
			})
	};

	return (
		<div id="login-form" className="form">
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
					Login
				</button>
			</div>
		</div>
	);
}

export default Login;