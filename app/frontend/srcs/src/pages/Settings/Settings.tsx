import EditUsername from "./EditUsername";
import EditProfilePicture from "./EditProfilePicture";
import EnableDoubleAuth from "./EnableDoubleAuth";

import "../../styles/Theme.css";

const Settings = () => {
    return (
        <div id="settings-div">
            <main id="main-settings">
                <h2>Settings</h2>
                <EditProfilePicture />
                <EditUsername />
                <EnableDoubleAuth />
            </main>
        </div>
    );
};
export default Settings;
