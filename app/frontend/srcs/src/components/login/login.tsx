import { Link } from "react-router-dom";
import LoginForm from "./loginForm";
import LoginOAuth from "./loginOAuth";

export default function Login() {

	return (
		<div>
			<LoginOAuth />
			<LoginForm />
			<div id="dontHaveAccount">
				<h2>You don't have an account ?</h2>
				<Link to="/register">Register</Link>
			</div>
		</div>
	);
}
