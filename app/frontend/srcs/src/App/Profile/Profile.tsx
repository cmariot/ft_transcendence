import { useOutletContext } from "react-router-dom";
import "../CSS/Profile.css";

const Profile = (props: any) => {
    return (
        <main id="profile">
            <img
                id="profile-user-picture"
                src={useOutletContext<any>()["userImage"]}
				alt="user-imag"
            />
            <h3>{useOutletContext<any>()["username"]}</h3>
        </main>
    );
};

export default Profile;
