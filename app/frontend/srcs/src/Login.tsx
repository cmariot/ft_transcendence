function Login()
{
	function handleLogin()
	{
		console.log("Button clicked");
	}

	return (
		<button onClick={handleLogin}>
			Login
		</button>
	);
}

export default Login;
