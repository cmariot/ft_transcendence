
function LoginFortyTwo() {
	function login42() {
		try {
			window.open("https://localhost:8443/api/auth/42", "_self");
		} catch (e) { console.error(e); }
	}

	return (
		<div>
			<button onClick={login42}>Login with 42</button>
		</div>
	)
}

export default LoginFortyTwo;
