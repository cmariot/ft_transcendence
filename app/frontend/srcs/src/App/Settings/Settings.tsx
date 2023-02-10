import { useOutletContext } from "react-router-dom";
import EditUsername from "./EditUsername";
import EditProfilePicture from "./EditProfilePicture";
import EnableDoubleAuth from "./EnableDoubleAuth";

const Settings = () => {
    let user = useOutletContext();
    return (
        <main id="main-settings">
            <h2>Settings</h2>
            <EditProfilePicture user={user} />
            <EditUsername user={user} />
            <EnableDoubleAuth user={user} />
        </main>
    );
};
export default Settings;
