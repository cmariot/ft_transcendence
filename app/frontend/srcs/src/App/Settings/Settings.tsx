import { useOutletContext } from "react-router-dom";
import EditUsername from "./EditUsername";
import EditProfilePicture from "./EditProfilePicture";

const Settings = (props) => {
    return (
        <main>
            <h2>Settings</h2>
            <EditProfilePicture userProps={useOutletContext()} />
            <EditUsername userProps={useOutletContext()} />
        </main>
    );
};
export default Settings;
