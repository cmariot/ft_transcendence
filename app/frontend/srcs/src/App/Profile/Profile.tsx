import "../CSS/Profile.css";
import { useContext } from "react";
import UserContext from "../../Contexts/UserContext";

const Profile = () => {
    const user = useContext(UserContext);
    return (
        <main id="profile">
            <img id="profile-user-picture" src={user.avatar} alt="user-imag" />
            <h3>{user.username}</h3>
        </main>
    );
};

export default Profile;
