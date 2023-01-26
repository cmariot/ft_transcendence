import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        const getProfile = async function () {
            await axios
                .get("https://localhost:8443/api/profile")
                .then((response) => {
                    setUsername(response.data.username);
                    setEmail(response.data.email);
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
    return (
        <main id="home-main">
            <h2>Profile</h2>
            <h3>Username : {username}</h3>
            <h3>Email : {email}</h3>
        </main>
    );
};
export default Profile;
