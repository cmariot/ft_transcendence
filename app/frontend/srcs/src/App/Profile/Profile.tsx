import { useOutletContext } from "react-router-dom";
import "../CSS/Profile.css";

const Profile = (props) => {
    return (
        <main id="profile">
            <img
                id="profile-user-picture"
                src={useOutletContext()["userImage"]}
            />
            <h3>{useOutletContext()["username"]}</h3>
        </main>
    );
};

export default Profile;
