
import Navbar from '../components/navbar/navbar'
import { Routes, Route } from "react-router-dom";
import Home from '../components/home/home'
import Login from '../components/login/login'
import About from '../components/about/about'
import Profile from '../components/profile/profile';
import Logout from '../components/logout/logout';
import RegisterForm from '../components/register/register';

function Main() {

	return (
		<div>
			<div className='content'>
				<Navbar></Navbar>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="Login" element={<Login />} />
					<Route path="Register" element={<RegisterForm />} />
					<Route path="About" element={<About />} />
					<Route path="Profile" element={<Profile />} />
					<Route path="Logout" element={<Logout />} />
				</Routes>
			</div>
		</div>
	);
}

export default Main;
