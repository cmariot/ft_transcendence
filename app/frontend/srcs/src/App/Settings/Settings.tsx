import EditUsername from "./EditUsername";
import EditProfilePicture from "./EditProfilePicture";
import EnableDoubleAuth from "./EnableDoubleAuth";

const Settings = () => {
    return (
        <main id="main-settings">
            <h2>Settings</h2>
            <EditProfilePicture />
            <EditUsername />
            <EnableDoubleAuth />
        </main>
    );
};
export default Settings;
