import axios from "axios";
import { useContext, useState } from "react";
import "../CSS/Settings.css";
import UserContext from "../../Contexts/UserContext";

export default function EnableDoubleAuth() {
    const user = useContext(UserContext);
    const [userPref, setUserPref] = useState(user.doubleAuth);

    function editDoubleAuth() {
        axios
            .post("/api/profile/update/doubleAuth")
            .then(function () {
                setUserPref(!user.doubleAuth);
                user.updateDoubleAuth();
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    return (
        <div id="edit-double-auth">
            <label>
                Double Authentification
                <input
                    type="checkbox"
                    checked={userPref}
                    id="input-double-auth"
                    onChange={editDoubleAuth}
                />
            </label>
        </div>
    );
}
