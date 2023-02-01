import axios from "axios";
import { useState } from "react";
import "../CSS/Settings.css";

export default function EnableDoubleAuth(props) {
    const [userPref, setUserPref] = useState(props.userProps.doubleAuth);

    function editDoubleAuth(event) {
        console.log("2FA = ", userPref);
        setUserPref(!userPref);
    }

    return (
        <div id="edit-double-auth">
            <label>
                Double Authentification
                <input
                    type="checkbox"
                    defaultChecked={userPref}
                    id="input-double-auth"
                    onChange={editDoubleAuth}
                />
            </label>
        </div>
    );
}
