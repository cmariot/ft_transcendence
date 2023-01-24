import axios from "axios";

function Logout() {
	function logout() {
		try {
			axios.get("https://localhost:8443/api/logout");
		} catch (e) { console.error(e); }
	}

	return (
		<div>
			<button onClick={logout}>Logout</button>
		</div>
	)
}

export default Logout;

