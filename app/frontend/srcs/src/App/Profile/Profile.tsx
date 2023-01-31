import { useOutletContext } from "react-router-dom";
import "../CSS/Profile.css";

const Profile = (props) => {
    return (
        <main id="profile">
            <h2>Profile</h2>
            <img
                id="profile-user-picture"
                src={useOutletContext()["userImage"]}
            />
            <h3>Username : {useOutletContext()["username"]}</h3>
            <h3>Email : </h3>
        </main>
    );
};

export default Profile;
