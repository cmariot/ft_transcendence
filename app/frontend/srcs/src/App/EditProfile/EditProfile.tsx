import { useNavigate } from "react-router-dom";
import UpdateProfileImage from "./UpdateProfileImage";
import UpdateUsername from "./UpdateUsername";

const EditProfile = (props) => {
    const navigate = useNavigate();

    function Ok() {
        navigate("/profile");
    }

    return (
        <main>
            <h2>Edit Profile</h2>
            <UpdateUsername />
            <UpdateProfileImage />
            <button onClick={Ok}>Ok</button>
        </main>
    );
};
export default EditProfile;
