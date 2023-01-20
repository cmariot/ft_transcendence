
import Navbar from '../components/navbar/navbar'
import  { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from '../components/home/home'
import Login from '../components/login/login'
import Register from '../components/register/register'
import About from '../components/about/about'

function Main() {

	return (
		<div>
			<div className='content'>
				<Navbar></Navbar>
						<Routes>
							<Route path="/" element={<Home />} />
							<Route path="Login" element={<Login />} />
							<Route path="Register" element={<Register />} />
							<Route path="About" element={<About />} />
						</Routes>
			</div>
		</div>
	);
}

export default Main;