import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./home-nav-bar.style.css"

const HomeNavbar = () => {
    
    const navigate = useNavigate();
    
    const logout = () => {
        axios.get("https://localhost:8443/api/logout")
        .then(() => {
            navigate('/login');
        })
        .catch((error) => {
            console.log(error);
        });
    }
    
    // lien username + proteger route
    return (
        <nav id="home-nav-bar">
            <h1>ft_transcendence</h1>
            <div id="home-nav-bar-user">
                <p>username</p>
                <button onClick={logout}>logout</button>
            </div>
        </nav>
    );
}
export default HomeNavbar;