import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./CSS/AppNavBar.css";

const AppNavbar = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");

    useEffect(() => {
        const getProfile = async function () {
            await axios
                .get("/api/profile")
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
            .get("/api/logout")
            .then(() => {
                navigate("/login");
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <nav id="app-nav-bar">
            <Link to="/">ft_transcendence</Link>
            <div id="app-nav-bar-user">
                <Link to="/profile">{username}</Link>
                <button className="button" onClick={logout}>
                    Logout
                </button>
            </div>
        </nav>
    );
};
export default AppNavbar;
