import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

    function handleChange(event) {
        event.preventDefault();
        const formData = new FormData();
        formData.append("file", event.target.files[0]);
        axios
            .post("/api/profile/update/image", formData, {
                headers: {
                    "content-type": "multipart/form-data",
                },
            })
            .then((response) => {
                console.log(response);
                // Il faudrait refresh l'image affiche dans le profil,
                // la il faut refresh la page ...
            })
            .catch((error) => {
                console.log(error);
            });
    }

    return (
        <main>
            <h2>Profile</h2>
            <img src="https://localhost:8443/api/profile/image" />
            <input type="file" accept="image/*" onChange={handleChange} />
            <h3>Username : {username}</h3>
            <h3>Email : {email}</h3>
        </main>
    );
};

export default Profile;
