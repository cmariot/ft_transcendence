import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/Profile.css";
import UpdateProfileImage from "../EditProfile/UpdateProfileImage";
import EditProfile from "../EditProfile/EditProfile";

const Profile = (props) => {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        const getProfile = async function () {
            await axios
                .get("/api/profile")
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
            .get("/api/logout")
            .then(() => {
                navigate("/login");
            })
            .catch((error) => {
                console.log(error);
            });
    };

    function edit() {
        navigate("/profile/edit");
    }

    return (
        <main>
            <h2>Profile</h2>
            <img src="/api/profile/image" />
            <h3>Username : {username}</h3>
            <h3>Email : {email}</h3>
            <button onClick={edit}>Edit</button>
        </main>
    );
};

export default Profile;
