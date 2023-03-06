import "../../styles/Profile.css";
import { useContext } from "react";
import { UserContext } from "../../Contexts/UserProvider";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const user = useContext(UserContext);
    const navigate = useNavigate();

    return (
        <main id="profile">
            <h2>Your profile</h2>
            <img
                id="profile-user-picture"
                src={user.avatar}
                alt="Your avatar"
            />
            <h3>{user.username}</h3>
            <button
                onClick={() => {
                    navigate("/settings");
                }}
            >
                edit
            </button>
        </main>
    );
};

export default Profile;
