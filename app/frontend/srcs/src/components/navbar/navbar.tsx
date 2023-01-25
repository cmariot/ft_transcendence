import { Link } from "react-router-dom";

function Navbar() {

	return (
		<div className="navbar">
			<h1>Navigation Bar du futuuuur</h1>
			<ul style={{ listStyleType: 'none', margin: 0, padding: 0 }}>
				<li><Link to="/">Home</Link></li>
				<li><Link to="/login">Login</Link></li>
				<li><Link to="/about">About</Link></li>
				<li><Link to="/profile">Profile</Link></li>
				<li><Link to="/logout">Logout</Link></li>
			</ul>
		</div>
	)
}

export default Navbar;
