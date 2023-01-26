import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./home-nav-bar.style.css";
import { useEffect, useState } from "react";

const HomeNavbar = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");

    useEffect(() => {
        const getProfile = async function () {
            await axios
                .get("https://localhost:8443/api/profile")
                .then((response) => {
                    setUsername(response.data.username);
                })
                .catch((error) => {
                    console.log(error);
                    logout();
                });
        };
        getProfile();
    }, []);

    const logout = () => {
        axios
            .get("https://localhost:8443/api/logout")
            .then(() => {
                navigate("/login");
            })
            .catch((error) => {
                console.log(error);
            });
    };

    // lien username + proteger route
    return (
        <nav id="home-nav-bar">
            <Link to="/">ft_transcendence</Link>
            <div id="home-nav-bar-user">
                <Link to="/profile">{username}</Link>
                <button className="button" onClick={logout}>
                    Logout
                </button>
            </div>
        </nav>
    );
};
export default HomeNavbar;
