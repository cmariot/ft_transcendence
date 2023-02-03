import { useOutletContext } from "react-router-dom";
import EditUsername from "./EditUsername";
import EditProfilePicture from "./EditProfilePicture";
import EnableDoubleAuth from "./EnableDoubleAuth";

const Settings = (props) => {
    return (
        <main id="main-settings">
            <h2>Settings</h2>
            <EditProfilePicture userProps={useOutletContext()} />
            <EditUsername userProps={useOutletContext()} />
            <EnableDoubleAuth userProps={useOutletContext()} />
        </main>
    );
};
export default Settings;
