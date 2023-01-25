
function LoginOAuth() {
	function login42() {
		try {
			window.open("https://localhost:8443/api/auth/42", "_self");
		} catch (e) { console.error(e); }
	}

	return (
		<div>
			<h2>Login with your 42 account</h2>
			<button onClick={login42}>Login</button>
		</div>
	)
}

export default LoginOAuth;
